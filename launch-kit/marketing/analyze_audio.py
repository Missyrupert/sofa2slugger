import re
import subprocess

raw_audio = "raw_warmup.mp3"
# Run silencedetect with -30dB and 0.5s duration
cmd = [
    "ffmpeg", "-i", raw_audio,
    "-af", "silencedetect=noise=-30dB:d=0.5",
    "-f", "null", "-"
]
res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)

# Parse output
starts = [float(x) for x in re.findall(r"silence_start:\s+([\d\.]+)", res.stderr)]
ends = [float(x) for x in re.findall(r"silence_end:\s+([\d\.]+)", res.stderr)]

print(f"Total silences found: {len(starts)}")
for idx, (s, e) in enumerate(zip(starts, ends)):
    print(f"Silence {idx+1}: {s:.2f}s to {e:.2f}s (duration: {e-s:.2f}s)")
