import os
import shutil
import subprocess

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

voiceover_path = os.path.join(script_dir, "promo_voiceover.mp3")

if not os.path.exists(voiceover_path):
    print(f"ERROR: Could not find promo_voiceover.mp3 at {voiceover_path}")
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
    exit(1)

print(f"Loaded promo_voiceover.mp3. Duration: {duration:.2f} seconds.")

# Timing breakdown for the 30-second promo
c1_dur = 6.5
c2_dur = 6.5
c3_dur = 11.0
c4_dur = duration - (c1_dur + c2_dur + c3_dur)

if c4_dur < 4.0:
    c4_dur = 6.0

total_video_dur = c1_dur + c2_dur + c3_dur + c4_dur
output_path = os.path.join(script_dir, "Sofa_To_Slugger_Promo_16_9.mp4")

# Check and copy the "Street Dark" hip-hop beat
promo_music_path = os.path.join(script_dir, "promo_music.wav")
if not os.path.exists(promo_music_path):
    src_music = os.path.join(project_root, "audio-production", "music-beds", "candidates", "s2s-python-street-dark.wav")
    if os.path.exists(src_music):
        try:
            shutil.copy(src_music, promo_music_path)
            print("Auto-copied high-energy 'Street Dark' hip-hop beat.")
        except Exception as e:
            print(f"Warning: Could not copy music bed: {e}")

round_bell_path = os.path.join(script_dir, "round-bell.wav")
if not os.path.exists(round_bell_path):
    src_bell = os.path.join(project_root, "audio-production", "sound-fx", "round-bell.wav")
    if os.path.exists(src_bell):
        try:
            shutil.copy(src_bell, round_bell_path)
            print("Auto-copied round bell sound effect.")
        except Exception as e:
            print(f"Warning: Could not copy round bell: {e}")

# Standardize clips 1, 2, 3 and the outro logo slide
clips = [
    os.path.join(script_dir, "Clip_1.mp4"),
    os.path.join(script_dir, "Clip_2.mp4"),
    os.path.join(script_dir, "Clip_3.mp4"),
    os.path.join(script_dir, "sofa-to-slugger-outro.png")
]

# Verify assets exist
missing = [c for c in clips if not os.path.exists(c)]
if missing:
    print("ERROR: Missing required files for compilation:")
    for m in missing:
        print(f"  - {m}")
    exit(1)

print("\n[MODE: Cinematic 16:9 Promo Trailer]")
print("Stitching widescreen clips and designing the 11.5s beat-drop...")

# Build FFmpeg command
# Inputs:
# 0: Clip_1.mp4 (6.5s)
# 1: Clip_2.mp4 (6.5s)
# 2: Clip_3.mp4 (11.0s)
# 3: sofa-to-slugger-outro.png (outro image, dynamic duration)
# 4: promo_voiceover.mp3 (voice)
# 5: promo_music.wav (heavy hip-hop beat)
# 6: round-bell.wav (drop bell)

ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-stream_loop", "-1", "-ss", "0", "-t", str(c1_dur), "-i", clips[0],
    "-stream_loop", "-1", "-ss", "0", "-t", str(c2_dur), "-i", clips[1],
    "-stream_loop", "-1", "-ss", "0", "-t", str(c3_dur), "-i", clips[2],
    "-loop", "1", "-t", f"{c4_dur:.2f}", "-i", clips[3],
    "-i", voiceover_path,
    "-stream_loop", "-1", "-i", promo_music_path,
    "-i", round_bell_path
]

# Filter complex for Video: Scale and pad all clips to 1920x1080 (16:9 widescreen)
filter_complex_str = (
    "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v0]; "
    "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v1]; "
    "[2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v2]; "
    "[3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v3]; "
    "[v0][v1][v2][v3]concat=n=4:v=1:a=0[v]; "
)

# Filter complex for Audio:
# 1. Voiceover (4:a) split to trigger sidechain compression
# 2. Music bed (5:a) volume is 0.03 (ambient murmur) before 11.5s, then jumps to 0.22 (heavy beat drop)
# 3. Bell (6:a) delayed to play exactly at 11.5s
# 4. Sidechain compress music under voiceover
# 5. Mix Voice, Ducked Music, and Bell with a limiter
filter_complex_str += (
    "[4:a]apad[voice_padded]; "
    "[voice_padded]asplit=2[voice1][voice2]; "
    "[5:a]volume='if(lt(t,11.5), 0.03, 0.20)':eval=frame,afade=t=in:ss=0:d=1[music_raw]; "
    "[6:a]adelay=11500|11500,volume=0.85[bell]; "
    "[music_raw][voice1]sidechaincompress=threshold=-24dB:ratio=4:attack=15:release=250[music_ducked]; "
    f"[voice2][music_ducked][bell]amix=inputs=3:duration=first:normalize=0,afade=t=out:st={total_video_dur-1.5:.2f}:d=1.5,alimiter=limit=0.95[a]"
)

ffmpeg_cmd.extend([
    "-filter_complex", filter_complex_str,
    "-map", "[v]",
    "-map", "[a]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-t", f"{total_video_dur:.2f}",
    output_path
])

try:
    print(f"\nExecuting: {' '.join(ffmpeg_cmd)}")
    subprocess.run(ffmpeg_cmd, check=True)
    print("\n================================================================")
    print("SUCCESS! Widescreen Cinematic Promo compiled successfully!")
    print(f"Saved: {output_path}")
    print("================================================================")
except subprocess.CalledProcessError as e:
    print(f"\nERROR: FFmpeg compilation failed: {e}")
