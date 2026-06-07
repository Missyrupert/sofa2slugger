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

voiceover_path = os.path.join(script_dir, "warmup_voiceover.mp3")

if not os.path.exists(voiceover_path):
    print("================================================================")
    print("ERROR: Could not find warmup voiceover file at:")
    print(f"  {voiceover_path}")
    print("\nTo generate this, please place your ElevenLabs or recorded voiceover")
    print("file here as 'warmup_voiceover.mp3'.")
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

print(f"Found warmup_voiceover.mp3. Duration: {duration:.2f} seconds.")

# Warmup clips duration blueprint (typically 3 minutes total)
c1_dur = 30.0
c2_dur = 60.0
c3_dur = 60.0
c4_dur = duration - (c1_dur + c2_dur + c3_dur)

if c4_dur < 5.0:
    c4_dur = 30.0 # Safety default if voiceover is shorter than expected

output_path = os.path.join(script_dir, "Sofa_To_Slugger_Warmup_16_9.mp4")

# Check and auto-copy assets
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

round_bell_path = os.path.join(script_dir, "round-bell.wav")
if not os.path.exists(round_bell_path):
    src_bell = os.path.join(script_dir, "..", "..", "audio-production", "sound-fx", "round-bell.wav")
    src_bell_abs = os.path.abspath(src_bell)
    if os.path.exists(src_bell_abs):
        try:
            shutil.copy(src_bell_abs, round_bell_path)
            print("Auto-copied S2S round bell sound effect.")
        except Exception as e:
            print(f"Warning: Could not copy round bell: {e}")

# Check for Warmup Clip video files or PNG screenshots
clips = []
missing_clips = []
clip4_is_image = False

for i in range(1, 5):
    clean_path = os.path.join(script_dir, f"Warmup_Clip_{i}.mp4")
    double_mp4 = os.path.join(script_dir, f"Warmup_Clip_{i}.mp4.mp4")
    
    # Auto-fix double mp4 extension
    if os.path.exists(double_mp4) and not os.path.exists(clean_path):
        try:
            os.rename(double_mp4, clean_path)
            print(f"Auto-corrected: renamed Warmup_Clip_{i}.mp4.mp4 -> Warmup_Clip_{i}.mp4")
        except Exception as e:
            print(f"Warning: Could not rename {double_mp4} to {clean_path}: {e}")
            clean_path = double_mp4

    if i == 4:
        png_path = os.path.join(script_dir, "Warmup_Clip_4.png")
        double_png = os.path.join(script_dir, "Warmup_Clip_4.png.png")
        
        # Auto-fix double png extension
        if os.path.exists(double_png) and not os.path.exists(png_path):
            try:
                os.rename(double_png, png_path)
                print("Auto-corrected: renamed Warmup_Clip_4.png.png -> Warmup_Clip_4.png")
            except Exception as e:
                print(f"Warning: Could not rename {double_png} to {png_path}: {e}")
                png_path = double_png

        if os.path.exists(png_path):
            clean_path = png_path
            clip4_is_image = True
            print("Detected Warmup_Clip_4 as static PNG screenshot.")
            
    if not os.path.exists(clean_path):
        if i == 4:
            missing_clips.append("Warmup_Clip_4.mp4 (or Warmup_Clip_4.png)")
        else:
            missing_clips.append(f"Warmup_Clip_{i}.mp4")
    clips.append(clean_path)

if missing_clips:
    print("================================================================")
    print("WARNING: The following landscape clips are missing from the folder:")
    for mc in missing_clips:
         print(f"  - {mc}")
    print("\nPlease place your landscape (16:9) stock or recorded clips here.")
    print("================================================================")
    input("Press Enter to close...")
    exit(1)

print("\n[MODE: Cinematic 16:9 Horizontal Guide]")
print("Stitching landscape videos, mixing audio ducking, and adding start/end boxing bells...")

has_music = os.path.exists(music_bed_path)
has_bell = os.path.exists(round_bell_path)

ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-stream_loop", "-1", "-ss", "0", "-t", str(c1_dur), "-i", clips[0],
    "-stream_loop", "-1", "-ss", "0", "-t", str(c2_dur), "-i", clips[1],
    "-stream_loop", "-1", "-ss", "0", "-t", str(c3_dur), "-i", clips[2],
]

if clip4_is_image:
    ffmpeg_cmd.extend(["-loop", "1", "-t", f"{c4_dur:.2f}", "-i", clips[3]])
else:
    ffmpeg_cmd.extend(["-stream_loop", "-1", "-ss", "0", "-t", f"{c4_dur:.2f}", "-i", clips[3]])

ffmpeg_cmd.append("-i")
ffmpeg_cmd.append(voiceover_path)

if has_music:
    ffmpeg_cmd.extend(["-stream_loop", "-1", "-i", music_bed_path])
if has_bell:
    ffmpeg_cmd.extend(["-i", round_bell_path])

# Video processing: Scale and pad to standard 1920x1080 widescreen, enforce 30fps CFR
filter_complex_str = (
    "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v0]; "
    "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v1]; "
    "[2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v2]; "
    "[3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v3]; "
    "[v0][v1][v2][v3]concat=n=4:v=1:a=0[v]"
)

# Audio processing:
# Input 4 is voiceover, Input 5 is music bed, Input 6 is round bell
# We split voiceover: voice1 goes to sidechain compress trigger, voice2 goes to mix
# We split the bell: bell1 plays at t=0, bell2 is delayed to play at the end of the voiceover
end_bell_delay_ms = int((duration - 2.5) * 1000)
if end_bell_delay_ms < 0:
    end_bell_delay_ms = 0

total_duration = c1_dur + c2_dur + c3_dur + c4_dur

audio_filter = "; [4:a]apad[voice_padded]"
audio_filter += "; [voice_padded]asplit=2[voice1][voice2]"

if has_music:
    audio_filter += "; [5:a]volume=0.20,afade=t=in:ss=0:d=3[music]"
    audio_filter += "; [music][voice1]sidechaincompress=threshold=-24dB:ratio=4:attack=15:release=250[bg_ducked]"
else:
    # If no music bed, create a dummy silence or bypass
    audio_filter += "; [voice1]amute[bg_ducked]"

if has_bell:
    # Split the single bell input to trigger at start and end
    # Note: adelay syntax for Windows/FFmpeg requires specifying delay for all channels
    audio_filter += f"; [6:a]asplit=2[bell_start][bell_end_raw]"
    audio_filter += f"; [bell_start]volume=0.9[bell1]"
    audio_filter += f"; [bell_end_raw]adelay={end_bell_delay_ms}|{end_bell_delay_ms},volume=0.9[bell2]"
    audio_filter += "; [bell1][bell2]amix=inputs=2:normalize=0[bells]"
    
    # Mix all three: Voice, Ducked Background Music, and Bells
    audio_filter += f"; [voice2][bg_ducked][bells]amix=inputs=3:duration=first:normalize=0,afade=t=out:st={total_duration-1.5:.2f}:d=1.5,alimiter=limit=0.95[a]"
else:
    audio_filter += f"; [voice2][bg_ducked]amix=inputs=2:duration=first:normalize=0,afade=t=out:st={total_duration-1.5:.2f}:d=1.5,alimiter=limit=0.95[a]"

filter_complex_str += audio_filter

ffmpeg_cmd.extend([
    "-filter_complex", filter_complex_str,
    "-map", "[v]",
    "-map", "[a]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-t", f"{total_duration:.2f}",
    output_path
])

try:
    print(f"\nExecuting: {' '.join(ffmpeg_cmd)}")
    subprocess.run(ffmpeg_cmd, check=True)
    print("\n================================================================")
    print("SUCCESS! Horizontal video compiled successfully!")
    print(f"Saved: {output_path}")
    print("================================================================")
except subprocess.CalledProcessError as e:
    print(f"\nERROR: FFmpeg compilation failed: {e}")

input("\nPress Enter to close...")
