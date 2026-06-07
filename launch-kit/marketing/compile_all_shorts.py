import os
import sys
import subprocess
import urllib.request

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

# 1. Load ElevenLabs configuration
api_key = None
voice_id = None
env_path = os.path.join(project_root, ".env.local")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if "=" in line:
                key, val = line.split("=", 1)
                if key.strip() == "ELEVENLABS_API_KEY":
                    api_key = val.strip()
                elif key.strip() == "ELEVENLABS_COACH_VOICE_ID":
                    voice_id = val.strip()

# 2. Curated visual B-roll links custom-selected for each Short's topic
# We use only verified, high-quality, pure Western Boxing vertical clips (no kicks, no shin wraps)
CURATED_SHORT_CLIPS = {
    1: {
        "topic": "The Jab Changes Everything (Pure Western Boxing Jabs)",
        "clips": [
            {"filename": "short_1_clip_1.mp4", "url": "https://videos.pexels.com/video-files/4761764/4761764-hd_1080_2048_25fps.mp4"}, # Boxer shadowboxing jabs in a spotlight (cottonbro)
            {"filename": "short_1_clip_2.mp4", "url": "https://videos.pexels.com/video-files/8810151/8810151-hd_1080_1920_24fps.mp4"}, # Boxer punching/shadowboxing in ring (Los Muertos)
            {"filename": "short_1_clip_3.mp4", "url": "https://videos.pexels.com/video-files/7314350/7314350-hd_1080_2048_25fps.mp4"}  # Pure shadowboxing hand strikes (Kaboompics)
        ]
    },
    2: {
        "topic": "Keep Your Guard Up (Defensive Guards & Boxing Stance)",
        "clips": [
            {"filename": "short_2_clip_1.mp4", "url": "https://videos.pexels.com/video-files/4761703/4761703-hd_1080_2048_25fps.mp4"}, # Boxer in a tight guard under spotlight (cottonbro)
            {"filename": "short_2_clip_2.mp4", "url": "https://videos.pexels.com/video-files/7987304/7987304-hd_1080_1920_30fps.mp4"}, # Boxer holding tight, centered guard (Ahuja)
            {"filename": "short_2_clip_3.mp4", "url": "https://videos.pexels.com/video-files/7314355/7314355-hd_1080_2048_25fps.mp4"}  # Stance and guard movement focus (Kaboompics)
        ]
    },
    3: {
        "topic": "Boxing Isn't About Fighting (Defense, Slipping & Weaving)",
        "clips": [
            {"filename": "short_3_clip_1.mp4", "url": "https://videos.pexels.com/video-files/4753945/4753945-hd_1080_2048_25fps.mp4"}, # Boxer practicing slipping & weaving (cottonbro)
            {"filename": "short_3_clip_2.mp4", "url": "https://videos.pexels.com/video-files/36019274/15274617_1080_1920_24fps.mp4"}, # Lateral boxing footwork sliding steps (Dato-on)
            {"filename": "short_3_clip_3.mp4", "url": "https://videos.pexels.com/video-files/7314307/7314307-hd_1080_2048_25fps.mp4"}  # Slow motion slipping/head movement (Kaboompics)
        ]
    },
    4: {
        "topic": "You Don't Need Confidence (Starting / Taking Action)",
        "clips": [
            {"filename": "short_4_clip_1.mp4", "url": "https://videos.pexels.com/video-files/6220072/6220072-hd_1080_2048_30fps.mp4"}, # Sitting on floor, tired/hesitant to start
            {"filename": "short_4_clip_2.mp4", "url": "https://videos.pexels.com/video-files/8513140/8513140-hd_1080_1920_30fps.mp4"}, # Putting in wireless earbud, setting up
            {"filename": "short_4_clip_3.mp4", "url": "https://videos.pexels.com/video-files/8809978/8809978-hd_1080_1920_24fps.mp4"}  # Stepping into a round of shadowboxing
        ]
    },
    5: {
        "topic": "Every Champion Looked Silly Once (Clumsy to Flow)",
        "clips": [
            {"filename": "short_5_clip_1.mp4", "url": "https://videos.pexels.com/video-files/6296379/6296379-hd_1080_1920_25fps.mp4"}, # Beginner training slow/clumsy punches
            {"filename": "short_5_clip_2.mp4", "url": "https://videos.pexels.com/video-files/6296159/6296159-hd_1080_1920_25fps.mp4"}, # Boxer shadowboxing/stance movement (Pavel Danilyuk)
            {"filename": "short_5_clip_3.mp4", "url": "https://videos.pexels.com/video-files/27098810/12071318_1080_1920_60fps.mp4"}  # High-flow, clean shadowboxing (cottonbro style)
        ]
    }
}

# Unified ending earbud insertion loop
SHARED_CLIP_4 = {
    "filename": "Clip_4.mp4",
    "url": "https://videos.pexels.com/video-files/6857213/6857213-hd_1080_2048_25fps.mp4"
}

def download_video(url, output_path):
    print(f"      Downloading from: {url}")
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response, open(output_path, "wb") as out_file:
            meta = response.info()
            file_size = int(meta.get("Content-Length", 0))
            print(f"      Size: {file_size / (1024*1024):.2f} MB")
            
            downloaded = 0
            block_size = 8192
            while True:
                buffer = response.read(block_size)
                if not buffer:
                    break
                downloaded += len(buffer)
                out_file.write(buffer)
                if file_size:
                    percent = downloaded * 100 / file_size
                    print(f"      Progress: {percent:.1f}%", end="\r")
            print("\n      [OK] Download complete!")
            return True
    except Exception as e:
        print(f"      [ERROR] Failed to download: {e}")
        return False

def check_assets(short_num):
    print(f"  [*] Checking visual assets for Short {short_num}...")
    
    # 1. Check/Download B-Roll Clips
    short_data = CURATED_SHORT_CLIPS[short_num]
    for clip_info in short_data["clips"]:
        filename = clip_info["filename"]
        clip_path = os.path.join(script_dir, filename)
        if not os.path.exists(clip_path):
            print(f"    [x] Missing clip: {filename}. Sourcing from Pexels CDN...")
            download_video(clip_info["url"], clip_path)
        else:
            print(f"    [OK] Clip ready: {filename}")

    # 2. Check/Download Shared Clip 4
    clip_4_path = os.path.join(script_dir, SHARED_CLIP_4["filename"])
    if not os.path.exists(clip_4_path):
        print(f"    [x] Missing shared ending: {SHARED_CLIP_4['filename']}. Sourcing...")
        download_video(SHARED_CLIP_4["url"], clip_4_path)
    else:
        print(f"    [OK] Shared ending ready: {SHARED_CLIP_4['filename']}")
        
    return True

def check_voiceover(short_num):
    vo_filename = f"short_{short_num}_voiceover.mp3"
    vo_path = os.path.join(script_dir, vo_filename)
    
    if os.path.exists(vo_path):
        print(f"  [OK] Voiceover already exists: {vo_filename}")
        return True

    print(f"  [x] Voiceover missing. Attempting to generate...")
    if not api_key:
        print("  [ERROR] Cannot generate: ELEVENLABS_API_KEY is missing in .env.local")
        return False
    if not voice_id:
        print("  [ERROR] Cannot generate: ELEVENLABS_COACH_VOICE_ID is missing in .env.local")
        return False

    cmd = [sys.executable, os.path.join(script_dir, "generate_shorts_voiceovers.py"), "--short", str(short_num)]
    try:
        subprocess.run(cmd, check=True)
        return os.path.exists(vo_path)
    except subprocess.CalledProcessError as e:
        print(f"  [ERROR] Voiceover generation script failed for Short {short_num}: {e}")
        return False

def compile_short(short_num):
    vo_filename = f"short_{short_num}_voiceover.mp3"
    output_filename = f"Short_{short_num}_Coach_CJ.mp4"
    output_path = os.path.join(script_dir, output_filename)
    
    short_data = CURATED_SHORT_CLIPS[short_num]
    clips = [c["filename"] for c in short_data["clips"]]
    screenshot = "Clip_4.png"
    
    print(f"  [*] Compiling Short {short_num}...")
    print(f"      Topic: {short_data['topic']}")
    print(f"      Visual sequence: {', '.join(clips)}")
    print(f"      Saving to: {output_filename}")
    
    cmd = [
        sys.executable, os.path.join(script_dir, "compile_generic_short.py"),
        "--voiceover", vo_filename,
        "--clips", clips[0], clips[1], clips[2],
        "--screenshot", screenshot,
        "--output", output_filename
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"  [OK] Short {short_num} compiled successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  [ERROR] Compilation failed for Short {short_num}: {e}")
        return False

def main():
    print("=================================================================")
    print("      SOFA2SLUGGER: MULTI-SHORT GENERATOR & COMPILER TOOL")
    print("=================================================================")
    
    print(f"Current Voice ID in .env.local: {voice_id}")
    print("This suite automatically downloads custom topic-matching B-roll")
    print("clips directly from Pexels CDN (completely free, no API key needed).")
    print("-----------------------------------------------------------------")
    
    print("Select an option:")
    print("1. Compile Short 1 (The Jab Changes Everything)")
    print("2. Compile Short 2 (Keep Your Guard Up)")
    print("3. Compile Short 3 (Boxing Isn't About Fighting)")
    print("4. Compile Short 4 (You Don't Need Confidence)")
    print("5. Compile Short 5 (Every Champion Looked Silly Once)")
    print("6. Generate, Download B-Roll, and Compile ALL 5 Shorts at once")
    print("-----------------------------------------------------------------")
    
    try:
        choice_str = input("Enter choice (1-6) and press Enter: ").strip()
        if not choice_str:
            print("No selection made. Exiting.")
            return
        choice = int(choice_str)
    except ValueError:
        print("Invalid choice. Please enter a number between 1 and 6.")
        return
        
    if choice in [1, 2, 3, 4, 5]:
        print(f"\nProcessing Short {choice}...")
        check_assets(choice)
        if check_voiceover(choice):
            compile_short(choice)
    elif choice == 6:
        print("\nProcessing ALL 5 Shorts...")
        success_count = 0
        for i in range(1, 6):
            print(f"\n--- SHORT {i} of 5 ---")
            check_assets(i)
            if check_voiceover(i):
                if compile_short(i):
                    success_count += 1
        print("\n=================================================================")
        print(f"All Batch Jobs Completed! Successfully compiled {success_count}/5 shorts.")
        print("=================================================================")
    else:
        print("Invalid choice. Please select a number from 1 to 6.")

if __name__ == "__main__":
    main()
