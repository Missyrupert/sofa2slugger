import os
import shutil
import subprocess
import ctypes.wintypes

def get_desktop_dir():
    CSIDL_DESKTOP = 0
    buf = ctypes.create_unicode_buffer(ctypes.wintypes.MAX_PATH)
    ctypes.windll.shell32.SHGetFolderPathW(None, CSIDL_DESKTOP, None, 0, buf)
    return buf.value

# Resolve directories
script_dir = os.path.dirname(os.path.abspath(__file__))
desktop_dir = get_desktop_dir()
old_s2s_desktop = os.path.join(desktop_dir, "S2S")

# 1. Automatic clean-up of locked Audacity files from Desktop S2S folder
if os.path.exists(old_s2s_desktop):
    print("Checking for leftover files on Desktop S2S folder...")
    cleaned_all = True
    for item in os.listdir(old_s2s_desktop):
        src_item = os.path.join(old_s2s_desktop, item)
        dest_item = os.path.join(script_dir, item)
        try:
            if os.path.exists(dest_item):
                os.remove(dest_item)
            shutil.move(src_item, dest_item)
            print(f"Moved file to project: {item}")
        except Exception as e:
            cleaned_all = False
    if cleaned_all:
        try:
            os.rmdir(old_s2s_desktop)
            print("Cleaned up and removed Desktop S2S folder!")
        except Exception as e:
            pass

voiceover_path = os.path.join(script_dir, "voiceover.mp3")

if not os.path.exists(voiceover_path):
    print("================================================================")
    print("ERROR: Could not find voiceover file at:")
    print(f"  {voiceover_path}")
    print("================================================================")
    input("Press Enter to close...")
    exit(1)

# Check duration of the voiceover using ffprobe
try:
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", voiceover_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    duration = float(result.stdout.strip())
except Exception as e:
    print(f"ERROR: Failed to read audio duration: {e}")
    input("Press Enter to close...")
    exit(1)

print(f"Found voiceover.mp3. Duration: {duration:.2f} seconds.")

s1_dur = duration * 0.25
s2_dur = duration * 0.35
s3_dur = duration * 0.30
s5_dur = 3.0 # Outro logo slide duration
s4_dur = duration * 0.10
total_duration = duration + s5_dur

output_path = os.path.join(script_dir, "Sofa_To_Slugger_Short.mp4")

# Check and auto-copy music bed if missing
music_bed_path = os.path.join(script_dir, "music_bed.wav")
if not os.path.exists(music_bed_path):
    src_music = os.path.join(script_dir, "..", "..", "audio-production", "music-beds", "candidates", "s2s-python-chill-ska-warm.wav")
    src_music_abs = os.path.abspath(src_music)
    if os.path.exists(src_music_abs):
        try:
            shutil.copy(src_music_abs, music_bed_path)
            print("Auto-copied clean instrumental music bed.")
        except Exception as e:
            print(f"Warning: Could not copy music bed: {e}")

# Check if we have MP4 B-Roll clips or PNG slides
video_clips = []
clip4_is_image = False
for i in range(1, 5):
    clean_path = os.path.join(script_dir, f"Clip_{i}.mp4")
    double_ext_path = os.path.join(script_dir, f"Clip_{i}.mp4.mp4")
    
    if os.path.exists(double_ext_path) and not os.path.exists(clean_path):
        try:
            os.rename(double_ext_path, clean_path)
            print(f"Auto-corrected: renamed Clip_{i}.mp4.mp4 -> Clip_{i}.mp4")
        except Exception as e:
            print(f"Warning: Could not rename {double_ext_path} to {clean_path}: {e}")
            clean_path = double_ext_path

    if i == 4:
        png_path = os.path.join(script_dir, "Clip_4.png")
        if os.path.exists(png_path):
            clean_path = png_path
            clip4_is_image = True
            print("Detected Clip_4 as static PNG screenshot.")
            
    video_clips.append(clean_path)

# B-Roll mode requires Clips 1, 2, 3, and Clip 4 (which can be mp4 or png)
has_video_broll = all(os.path.exists(clip) for clip in video_clips)

if has_video_broll:
    print("\n[MODE: Cinematic Moving B-Roll]")
    print("Stitching and center-cropping landscape videos to 9:16 vertical...")
    
    logo_path = os.path.join(script_dir, "sofa-to-slugger-outro.png")
    has_music = os.path.exists(music_bed_path)
    
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-ss", "0", "-t", f"{s1_dur:.2f}", "-i", video_clips[0],
        "-stream_loop", "-1", "-ss", "0", "-t", f"{s2_dur:.2f}", "-i", video_clips[1],
        "-stream_loop", "-1", "-ss", "0", "-t", f"{s3_dur:.2f}", "-i", video_clips[2],
    ]
    
    if clip4_is_image:
        ffmpeg_cmd.extend(["-loop", "1", "-t", f"{s4_dur:.2f}", "-i", video_clips[3]])
    else:
        ffmpeg_cmd.extend(["-stream_loop", "-1", "-ss", "0", "-t", f"{s4_dur:.2f}", "-i", video_clips[3]])
        
    ffmpeg_cmd.extend([
        "-loop", "1", "-t", f"{s5_dur:.2f}", "-i", logo_path,
        "-i", voiceover_path,
    ])
    
    if has_music:
        ffmpeg_cmd.extend(["-stream_loop", "-1", "-i", music_bed_path])
        print("Including music bed in compilation.")
        
    if clip4_is_image:
        clip4_filter = f"[3:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v3]; "
    else:
        clip4_filter = f"[3:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,setpts=PTS-STARTPTS,fps=30,tpad=stop_mode=clone:stop=-1,trim=duration={s4_dur:.2f}[v3]; "

    filter_complex_str = (
        "[0:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v0]; "
        "[1:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v1]; "
        "[2:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v2]; "
        + clip4_filter +
        "[4:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v4]; "
        "[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]"
    )
    
    if has_music:
        # Input 5 is voiceover, Input 6 is music bed (WAV)
        # Apply sidechain compression (ducking) and brickwall limiter for best-in-class audio mix
        # Note: we use asplit=2 on the voiceover because stream labels can only be consumed once in FFmpeg
        filter_complex_str += (
            "; [5:a]apad[voice_padded]; "
            "[voice_padded]asplit=2[voice1][voice2]; "
            "[6:a]volume=0.22,afade=t=in:ss=0:d=2[music]; "
            "[music][voice1]sidechaincompress=threshold=-22dB:ratio=4:attack=15:release=250[bg_ducked]; "
            f"[voice2][bg_ducked]amix=inputs=2:duration=first:normalize=0,afade=t=out:st={total_duration-1.5:.2f}:d=1.5,alimiter=limit=0.95[a]"
        )
        audio_map = "[a]"
    else:
        audio_map = "5:a"
        
    ffmpeg_cmd.extend([
        "-filter_complex", filter_complex_str,
        "-map", "[v]",
        "-map", audio_map,
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", f"{total_duration:.2f}",
        output_path
    ])
else:
    print("\n[MODE: Branded Static Slides]")
    slide1 = os.path.join(script_dir, "Slide_1_The_Gym_Trap.png")
    slide2 = os.path.join(script_dir, "Slide_2_Gym_Pressure.png")
    slide3 = os.path.join(script_dir, "Slide_3_Living_Room_Comfort.png")
    slide4 = os.path.join(script_dir, "Slide_4_Sofa_To_Slugger_CTA.png")
    
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-t", f"{s1_dur:.2f}", "-i", slide1,
        "-loop", "1", "-t", f"{s2_dur:.2f}", "-i", slide2,
        "-loop", "1", "-t", f"{s3_dur:.2f}", "-i", slide3,
        "-loop", "1", "-t", f"{s4_dur:.2f}", "-i", slide4,
        "-loop", "1", "-t", f"{s5_dur:.2f}", "-i", logo_path,
        "-i", voiceover_path,
        "-filter_complex", "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0[v]",
        "-map", "[v]", "-map", "5:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", f"{total_duration:.2f}",
        output_path
    ]

try:
    print(f"Executing: {' '.join(ffmpeg_cmd)}")
    subprocess.run(ffmpeg_cmd, check=True)
    print("\n================================================================")
    print("SUCCESS! Video compiled successfully!")
    print(f"Saved: {output_path}")
    print("================================================================")
except subprocess.CalledProcessError as e:
    print(f"\nERROR: FFmpeg compilation failed: {e}")

input("\nPress Enter to close...")
