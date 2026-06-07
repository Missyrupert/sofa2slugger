import os
import shutil
import subprocess

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

voiceover_path = os.path.join(script_dir, "living_room_voiceover.mp3")

if not os.path.exists(voiceover_path):
    print("================================================================")
    print("WARNING: Could not find 'living_room_voiceover.mp3' in marketing folder.")
    print("Please record your voiceover in Audacity, apply the 'Warm Voice' post-processing,")
    print("and export it as 'living_room_voiceover.mp3' here.")
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

print(f"Found living_room_voiceover.mp3. Duration: {duration:.2f} seconds.")

# Visual timing breakdown based on the script:
c1_dur = 5.0
c2_dur = 15.0
c3_dur = 20.0
c4_dur = duration - (c1_dur + c2_dur + c3_dur)

if c4_dur < 4.0:
    c4_dur = 8.0

output_path = os.path.join(script_dir, "Sofa_To_Slugger_Living_Room_Ring.mp4")

# Check for music and assets
promo_music_path = os.path.join(script_dir, "promo_music.wav")
if not os.path.exists(promo_music_path):
    src_music = os.path.join(project_root, "audio-production", "music-beds", "candidates", "s2s-python-street-dark.wav")
    if os.path.exists(src_music):
        try:
            shutil.copy(src_music, promo_music_path)
            print("Auto-copied dark hip-hop promo music bed.")
        except Exception as e:
            print(f"Warning: Could not copy music bed: {e}")

# Standardize clips 1, 2, 3 and the outro logo slide
clips = [
    os.path.join(script_dir, "Ring_Clip_1.mp4"),
    os.path.join(script_dir, "Ring_Clip_2.mp4"),
    os.path.join(script_dir, "Ring_Clip_3.mp4"),
    os.path.join(script_dir, "sofa-to-slugger-outro.png")
]

# Verify assets exist
missing = [c for c in clips if not os.path.exists(c)]
if missing:
    print("================================================================")
    print("WARNING: The following assets are missing from the folder:")
    for m in missing:
        print(f"  - {os.path.basename(m)}")
    print("\nPlease place your custom recorded or stock video clips in the folder.")
    print("================================================================")
    input("Press Enter to close...")
    exit(1)

print("\n[MODE: Living Room Ring Short (9:16)]")
print("Stitching vertical clips, mixing voice, and ducking the dark hip-hop beat...")

# Build FFmpeg command
# Inputs:
# 0: Ring_Clip_1.mp4 (5s)
# 1: Ring_Clip_2.mp4 (15s)
# 2: Ring_Clip_3.mp4 (20s)
# 3: sofa-to-slugger-outro.png (dynamic duration)
# 4: living_room_voiceover.mp3 (voiceover)
# 5: promo_music.wav (beat)

ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-stream_loop", "-1", "-ss", "0", "-t", str(c1_dur), "-i", clips[0],
    "-stream_loop", "-1", "-ss", "0", "-t", str(c2_dur), "-i", clips[1],
    "-stream_loop", "-1", "-ss", "0", "-t", str(c3_dur), "-i", clips[2],
    "-loop", "1", "-t", f"{c4_dur:.2f}", "-i", clips[3],
    "-i", voiceover_path,
    "-stream_loop", "-1", "-i", promo_music_path
]

# Video processing: Crop landscape to 9:16 vertical, scale to 1080x1920, and concatenate
filter_complex_str = (
    "[0:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v0]; "
    "[1:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v1]; "
    "[2:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v2]; "
    "[3:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v3]; "
    "[v0][v1][v2][v3]concat=n=4:v=1:a=0[v]; "
)

# Audio processing:
# 1. Pad voiceover to prevent cutoff, then split
# 2. Fade in music bed and duck it by 14dB under the speech
# 3. Mix and fade out at the end
total_duration = c1_dur + c2_dur + c3_dur + c4_dur

filter_complex_str += (
    "[4:a]apad[voice_padded]; "
    "[voice_padded]asplit=2[voice1][voice2]; "
    "[5:a]volume=0.22,afade=t=in:ss=0:d=2[music_raw]; "
    "[music_raw][voice1]sidechaincompress=threshold=-24dB:ratio=4:attack=15:release=250[music_ducked]; "
    f"[voice2][music_ducked]amix=inputs=2:duration=first:normalize=0,afade=t=out:st={total_duration-1.5:.2f}:d=1.5,alimiter=limit=0.95[a]"
)

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
    print("SUCCESS! Living Room Ring Short compiled successfully!")
    print(f"Saved: {output_path}")
    print("================================================================")
except subprocess.CalledProcessError as e:
    print(f"\nERROR: FFmpeg compilation failed: {e}")

input("\nPress Enter to close...")
