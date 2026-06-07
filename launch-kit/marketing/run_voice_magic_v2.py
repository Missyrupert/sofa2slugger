import os
import subprocess
import sys

marketing_dir = r"c:\Users\chris\Projects\Active\s2s\launch-kit\marketing"

def main():
    print("=================================================================")
    print("      SOFA2SLUGGER: RE-COMPILING SHORT 1 WITH WESTERN BOXING")
    print("=================================================================")
    
    # 1. Clean old files to force new download and voiceover generation
    print("[1/3] Deleting old test files...")
    
    old_files = [
        "short_1_voiceover.mp3",
        "short_1_clip_1.mp4",
        "short_1_clip_2.mp4",
        "short_1_clip_3.mp4",
        "Short_1_Coach_CJ.mp4"
    ]
    
    for f in old_files:
        path = os.path.join(marketing_dir, f)
        if os.path.exists(path):
            try:
                os.remove(path)
                print(f"  [-] Deleted: {f}")
            except Exception as e:
                print(f"  [ERROR] Could not delete {f}: {e}")
                
    # 2. Run the compiler programmatically for Short 1
    print("\n[2/3] Executing compilation script programmatically (Curated Mode)...")
    
    # We invoke it using python -c to run the functions directly, bypassing prompts!
    cmd = [
        sys.executable, "-c",
        "import sys; sys.path.append(r'c:\\Users\\chris\\Projects\\Active\\s2s\\launch-kit\\marketing'); "
        "import compile_all_shorts; "
        "compile_all_shorts.check_assets(1); "
        "compile_all_shorts.check_voiceover(1); "
        "compile_all_shorts.compile_short(1)"
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print("\n=================================================================")
        print("    SUCCESS! UPDATED CLONE SHORT COMPILED SUCCESSFULLY!")
        print(f"    Saved to: {os.path.join(marketing_dir, 'Short_1_Coach_CJ.mp4')}")
        print("=================================================================")
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Compilation failed: {e}")

if __name__ == "__main__":
    main()
