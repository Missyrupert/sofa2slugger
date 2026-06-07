import os
import subprocess
import sys

marketing_dir = r"c:\Users\chris\Projects\Active\s2s\launch-kit\marketing"

def main():
    print("=================================================================")
    print("           SOFA2SLUGGER: PIPELINE TEST RUNNER")
    print("=================================================================")
    
    # 1. Delete old clips
    print("[1/4] Deleting old clips to ensure fresh downloads...")
    for i in range(1, 5):
        clip_name = f"Clip_{i}.mp4"
        clip_path = os.path.join(marketing_dir, clip_name)
        if os.path.exists(clip_path):
            try:
                os.remove(clip_path)
                print(f"  [-] Deleted: {clip_name}")
            except Exception as e:
                print(f"  [ERROR] Could not delete {clip_name}: {e}")
        else:
            print(f"  [.] {clip_name} not found, ready for new download.")
            
    # 2. Run stock video sourcer
    print("\n[2/4] Sourcing fresh vertical B-roll from Pexels API...")
    sourcer_script = os.path.join(marketing_dir, "download_stock_videos.py")
    try:
        # Run it non-interactively in curated mode
        subprocess.run([sys.executable, sourcer_script, "--mode", "curated"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Stock video downloader failed: {e}")
        return

    # Check if download succeeded
    downloaded_all = True
    for i in range(1, 5):
        clip_path = os.path.join(marketing_dir, f"Clip_{i}.mp4")
        if not os.path.exists(clip_path):
            print(f"  [ERROR] Missing downloaded clip: Clip_{i}.mp4")
            downloaded_all = False
            
    if not downloaded_all:
        print("\n[ERROR] Sourcing incomplete. Aborting pipeline test.")
        return
        
    print("\n[OK] All stock B-roll clips successfully downloaded!")

    # 3. Generate Voiceover for Short 1 (using default coach voice George for test)
    print("\n[3/4] Generating test voiceover for Short 1 (George voice)...")
    vo_script = os.path.join(marketing_dir, "generate_shorts_voiceovers.py")
    # George voice ID: waye9U5Y78f4YaHwzOJa
    cmd_vo = [sys.executable, vo_script, "--short", "1", "--voice_id", "waye9U5Y78f4YaHwzOJa"]
    try:
        subprocess.run(cmd_vo, check=True)
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Voiceover generation failed: {e}")
        return
        
    vo_file = os.path.join(marketing_dir, "short_1_voiceover.mp3")
    if not os.path.exists(vo_file):
        print("\n[ERROR] Voiceover file was not created. Aborting.")
        return
        
    print("\n[OK] Test voiceover generated successfully!")

    # 4. Compile the Short
    print("\n[4/4] Compiling final vertical video...")
    compiler_script = os.path.join(marketing_dir, "compile_generic_short.py")
    output_filename = "Short_1_George_Test.mp4"
    
    cmd_compile = [
        sys.executable, compiler_script,
        "--voiceover", "short_1_voiceover.mp3",
        "--clips", "Clip_1.mp4", "Clip_2.mp4", "Clip_3.mp4",
        "--screenshot", "Clip_4.png",
        "--output", output_filename
    ]
    try:
        subprocess.run(cmd_compile, check=True)
        print("\n=================================================================")
        print("          SUCCESS! TEST SHORT COMPILED SUCCESSFULLY!")
        print(f"Output saved to: {os.path.join(marketing_dir, output_filename)}")
        print("=================================================================")
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Compilation script failed: {e}")

if __name__ == "__main__":
    main()
