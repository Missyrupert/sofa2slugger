import os
import argparse
import shutil
import subprocess

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

def main():
    parser = argparse.ArgumentParser(description="Compile a generic Sofa2Slugger 9:16 vertical Short.")
    parser.add_argument("--voiceover", required=True, help="Filename or path of the voiceover MP3 in marketing folder")
    parser.add_argument("--clips", nargs=3, required=True, help="Three visual background MP4 clips (e.g. Clip_1.mp4 Clip_2.mp4 Clip_3.mp4)")
    parser.add_argument("--screenshot", required=True, help="App UI screenshot or visual for the final segment (e.g. Clip_4.png)")
    parser.add_argument("--output", required=True, help="Output filename for the compiled Short (e.g. Short_1.mp4)")
    parser.add_argument("--music", default="promo_music.wav", help="Music bed filename in marketing folder (defaults to promo_music.wav)")
    parser.add_argument("--outro", default="sofa-to-slugger-outro.png", help="Outro image card in marketing folder (defaults to sofa-to-slugger-outro.png)")

    args = parser.parse_args()

    # Resolve paths
    vo_path = os.path.join(script_dir, args.voiceover) if not os.path.isabs(args.voiceover) else args.voiceover
    screenshot_path = os.path.join(script_dir, args.screenshot) if not os.path.isabs(args.screenshot) else args.screenshot
    music_path = os.path.join(script_dir, args.music) if not os.path.isabs(args.music) else args.music
    outro_path = os.path.join(script_dir, args.outro) if not os.path.isabs(args.outro) else args.outro
    out_path = os.path.join(script_dir, args.output) if not os.path.isabs(args.output) else args.output

    # Resolve background clips
    clip_paths = []
    for c in args.clips:
        c_path = os.path.join(script_dir, c) if not os.path.isabs(c) else c
        clip_paths.append(c_path)

    # Verify key paths
    for p, name in [(vo_path, "Voiceover"), (screenshot_path, "App Screenshot"), (music_path, "Music Bed"), (outro_path, "Outro Card")]:
        if not os.path.exists(p):
            print(f"ERROR: Could not find {name} file at: {p}")
            return

    for idx, cp in enumerate(clip_paths):
        if not os.path.exists(cp):
            print(f"ERROR: Could not find Clip {idx+1} at: {cp}")
            return

    # Check duration of the voiceover using ffprobe
    try:
        cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", vo_path
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        duration = float(result.stdout.strip())
    except Exception as e:
        print(f"ERROR: Failed to read voiceover duration: {e}")
        return

    print(f"\nVoiceover duration: {duration:.2f} seconds.")

    # Calculate dynamic timing fractions based on voiceover duration
    c1_dur = duration * 0.25
    c2_dur = duration * 0.35
    c3_dur = duration * 0.30
    c4_dur = duration * 0.10
    outro_dur = 3.0
    total_duration = duration + outro_dur

    print(f"Timings: Clip 1={c1_dur:.2f}s | Clip 2={c2_dur:.2f}s | Clip 3={c3_dur:.2f}s | Screenshot={c4_dur:.2f}s | Outro={outro_dur:.2f}s")
    print(f"Total Video Duration: {total_duration:.2f} seconds.")

    # Build FFmpeg compiler command
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-stream_loop", "-1", "-ss", "0", "-t", f"{c1_dur:.2f}", "-i", clip_paths[0],
        "-stream_loop", "-1", "-ss", "0", "-t", f"{c2_dur:.2f}", "-i", clip_paths[1],
        "-stream_loop", "-1", "-ss", "0", "-t", f"{c3_dur:.2f}", "-i", clip_paths[2],
        "-loop", "1", "-t", f"{c4_dur:.2f}", "-i", screenshot_path,
        "-loop", "1", "-t", f"{outro_dur:.2f}", "-i", outro_path,
        "-i", vo_path,
        "-stream_loop", "-1", "-i", music_path
    ]

    # Filter complex: Crop and scale visual clips to 1080x1920, and concatenate
    filter_complex_str = (
        "[0:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v0]; "
        "[1:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v1]; "
        "[2:v]crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920,setsar=1,fps=30,setpts=PTS-STARTPTS[v2]; "
        "[3:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v3]; "
        "[4:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0C0C0E,setsar=1,fps=30,setpts=PTS-STARTPTS[v4]; "
        "[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]; "
    )

    filter_complex_str += (
        "[5:a]apad[voice_padded]; "
        "[voice_padded]asplit=2[voice1][voice2]; "
        "[6:a]volume=0.22,afade=t=in:ss=0:d=2[music_raw]; "
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
        out_path
    ])

    print("\nExecuting compilation command...")
    try:
        subprocess.run(ffmpeg_cmd, check=True)
        print("\n================================================================")
        print("SUCCESS! Short compiled successfully!")
        print(f"Saved to: {out_path}")
        print("================================================================")
    except subprocess.CalledProcessError as e:
        print(f"\nERROR: FFmpeg compilation failed: {e}")

if __name__ == "__main__":
    main()
