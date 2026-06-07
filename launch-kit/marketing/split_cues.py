import os
import re
import subprocess

script_dir = os.path.dirname(os.path.abspath(__file__))
raw_audio = os.path.join(script_dir, "raw_warmup.mp3")
output_audio = os.path.join(script_dir, "warmup_voiceover.mp3")

def run_silence_detect(threshold_db, min_duration=0.5):
    # Runs FFmpeg silencedetect and returns the stderr output
    cmd = [
        "ffmpeg", "-i", raw_audio,
        "-af", f"silencedetect=noise={threshold_db}dB:d={min_duration}",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    return res.stderr

def parse_segments(ffmpeg_log):
    # Find silence start and end times
    starts = [float(x) for x in re.findall(r"silence_start:\s+([\d\.]+)", ffmpeg_log)]
    ends = [float(x) for x in re.findall(r"silence_end:\s+([\d\.]+)", ffmpeg_log)]
    
    # Get audio duration using ffprobe
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", raw_audio
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)
    total_duration = float(res.stdout.strip())
    
    # Reconstruct non-silent active segments
    segments = []
    current_start = 0.0
    
    # Silence detection splits the timeline. If there are no silences:
    if not starts:
        return [(0.0, total_duration)]
        
    for s_start, s_end in zip(starts, ends):
        if s_start > current_start + 0.2: # Ignore tiny fragments
            segments.append((current_start, s_start))
        current_start = s_end
        
    if total_duration > current_start + 0.2:
        segments.append((current_start, total_duration))
        
    return segments

# Try to find exactly 7 segments by tuning the dB threshold
target_db = -35
segments = []
for db in range(-45, -15, 2):
    log = run_silence_detect(db)
    segs = parse_segments(log)
    print(f"Threshold: {db}dB -> Found {len(segs)} segments")
    if len(segs) == 7:
        target_db = db
        segments = segs
        break
    # Keep track of closest match
    if not segments or abs(len(segs) - 7) < abs(len(segments) - 7):
        target_db = db
        segments = segs

print(f"\nSelected Threshold: {target_db}dB")
print(f"Detected Segments: {segments}")

if len(segments) != 7:
    print(f"WARNING: Found {len(segments)} segments instead of the expected 7.")
    print("We will proceed using the detected segments.")

# target timestamps for the 7 cues:
# 0:00, 0:15, 0:30, 1:00, 1:30, 2:00, 2:30
target_starts = [0.0, 15.0, 30.0, 60.0, 90.0, 120.0, 150.0]

# Generate temporary split files
tmp_files = []
filter_inputs = []
filter_complex = ""

for idx, (start, end) in enumerate(segments):
    tmp_out = os.path.join(script_dir, f"tmp_cue_{idx}.mp3")
    # Trim segment out of raw audio
    cmd = [
        "ffmpeg", "-y", "-ss", str(start), "-to", str(end),
        "-i", raw_audio, "-c:a", "libmp3lame", "-q:a", "2", tmp_out
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    tmp_files.append(tmp_out)

# Build a single FFmpeg filter complex command to delay and mix the clips
# e.g. -i tmp_cue_0.mp3 -i tmp_cue_1.mp3...
# -filter_complex "[0:a]adelay=0|0[a0]; [1:a]adelay=15000|15000[a1]; ... [a0][a1]...amix=inputs=7:normalize=0"
ffmpeg_stitch = ["ffmpeg", "-y"]
for tf in tmp_files:
    ffmpeg_stitch.extend(["-i", tf])

filter_str = ""
for idx in range(len(tmp_files)):
    delay_ms = int(target_starts[idx] * 1000) if idx < len(target_starts) else int(target_starts[-1] * 1000)
    filter_str += f"[{idx}:a]adelay={delay_ms}|{delay_ms}[a{idx}]; "

mix_inputs = "".join(f"[a{idx}]" for idx in range(len(tmp_files)))
filter_str += f"{mix_inputs}amix=inputs={len(tmp_files)}:normalize=0[out]"

ffmpeg_stitch.extend([
    "-filter_complex", filter_str,
    "-map", "[out]",
    "-c:a", "libmp3lame", "-q:a", "2",
    output_audio
])

print(f"Stitching files together to: {output_audio}")
subprocess.run(ffmpeg_stitch, check=True)

# Clean up temp files
for tf in tmp_files:
    try:
        os.remove(tf)
    except:
        pass

print("\nSUCCESS! Saved final warmup_voiceover.mp3!")
