import os
import re
import subprocess

script_dir = os.path.dirname(os.path.abspath(__file__))
raw_audio = os.path.join(script_dir, "raw_warmup.mp3")
output_audio = os.path.join(script_dir, "warmup_voiceover.mp3")

def run_silence_detect():
    # Detect silences that are at least 2.8 seconds long
    cmd = [
        "ffmpeg", "-i", raw_audio,
        "-af", "silencedetect=noise=-32dB:d=2.8",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    return res.stderr

def parse_cues(ffmpeg_log):
    starts = [float(x) for x in re.findall(r"silence_start:\s+([\d\.]+)", ffmpeg_log)]
    ends = [float(x) for x in re.findall(r"silence_end:\s+([\d\.]+)", ffmpeg_log)]
    
    # Get total file duration
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", raw_audio
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)
    total_duration = float(res.stdout.strip())
    
    cues = []
    # If the first silence starts at 0.0, the first cue starts at its end.
    # We expect 7 silences:
    # Silence 1 (intro), Silence 2, Silence 3, Silence 4, Silence 5, Silence 6, Silence 7.
    # Cue 1: end of Silence 1 to start of Silence 2
    # Cue 2: end of Silence 2 to start of Silence 3
    # ...
    # Cue 7: end of Silence 7 to end of file.
    
    if len(starts) == 7:
        print("Successfully detected exactly 7 silences separating the cues!")
        for i in range(6):
            cues.append((ends[i], starts[i+1]))
        cues.append((ends[6], total_duration))
    else:
        print(f"Warning: Silence detection found {len(starts)} silences instead of 7.")
        # Fallback to hardcoded list based on the manual analysis of the file
        print("Using fallback boundaries from manual track analysis.")
        cues = [
            (4.73, 23.60),
            (28.27, 42.27),
            (46.74, 57.88),
            (61.79, 69.42),
            (74.08, 87.15),
            (90.57, 98.86),
            (102.30, total_duration)
        ]
    return cues

print("Analyzing audio file raw_warmup.mp3...")
log = run_silence_detect()
cues = parse_cues(log)

for idx, (start, end) in enumerate(cues):
    print(f"Cue {idx+1}: {start:.2f}s to {end:.2f}s (duration: {end-start:.2f}s)")

# Stitching target starts:
target_starts = [0.0, 15.0, 30.0, 60.0, 90.0, 120.0, 150.0]

tmp_files = []
for idx, (start, end) in enumerate(cues):
    tmp_out = os.path.join(script_dir, f"tmp_cue_{idx}.mp3")
    cmd = [
        "ffmpeg", "-y", "-ss", f"{start:.3f}", "-to", f"{end:.3f}",
        "-i", raw_audio, "-c:a", "libmp3lame", "-q:a", "2", tmp_out
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    tmp_files.append(tmp_out)

# Build the stitch command
ffmpeg_stitch = ["ffmpeg", "-y"]
for tf in tmp_files:
    ffmpeg_stitch.extend(["-i", tf])

filter_str = ""
for idx in range(len(tmp_files)):
    delay_ms = int(target_starts[idx] * 1000)
    filter_str += f"[{idx}:a]adelay={delay_ms}|{delay_ms}[a{idx}]; "

mix_inputs = "".join(f"[a{idx}]" for idx in range(len(tmp_files)))
filter_str += f"{mix_inputs}amix=inputs={len(tmp_files)}:normalize=0[out]"

ffmpeg_stitch.extend([
    "-filter_complex", filter_str,
    "-map", "[out]",
    "-c:a", "libmp3lame", "-q:a", "2",
    output_audio
])

print("\nStitching cues at exact warmup timestamps...")
subprocess.run(ffmpeg_stitch, check=True)

# Cleanup
for tf in tmp_files:
    try:
        os.remove(tf)
    except:
        pass

print(f"\n================================================================")
print("SUCCESS! Timing-adjusted voiceover track compiled!")
print(f"Saved: {output_audio}")
print(f"================================================================")
