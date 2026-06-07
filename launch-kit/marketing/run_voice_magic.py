import os
import subprocess
import sys

marketing_dir = r"c:\Users\chris\Projects\Active\s2s\launch-kit\marketing"

def main():
    print("=================================================================")
    print("      SOFA2SLUGGER: COMPILING SHORT 1 WITH CUSTOM CLONE")
    print("=================================================================")
    
    # 1. Generate Voiceover using custom clone 7wYG9HACHWxsRmADWjQI
    # Since we updated .env.local, we just run the generate script without overrides!
    print("[1/2] Calling ElevenLabs to generate Short 1 voiceover with Coach CJ...")
    vo_script = os.path.join(marketing_dir, "generate_shorts_voiceovers.py")
    cmd_vo = [sys.executable, vo_script, "--short", "1"]
    
    try:
        subprocess.run(cmd_vo, check=True)
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Voiceover generation failed: {e}")
        return
        
    vo_file = os.path.join(marketing_dir, "short_1_voiceover.mp3")
    if not os.path.exists(vo_file):
        print("\n[ERROR] Voiceover file was not created. Aborting.")
        return
        
    print("\n[OK] Voiceover generated successfully with your voice clone!")

    # 2. Compile the Short
    print("\n[2/2] Compiling final vertical video...")
    compiler_script = os.path.join(marketing_dir, "compile_generic_short.py")
    output_filename = "Short_1_Coach_CJ.mp4"
    
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
        print("     SUCCESS! REAL CLONE SHORT COMPILED SUCCESSFULLY!")
        print(f"Saved to: {os.path.join(marketing_dir, output_filename)}")
        print("=================================================================")
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Compilation script failed: {e}")

if __name__ == "__main__":
    main()
