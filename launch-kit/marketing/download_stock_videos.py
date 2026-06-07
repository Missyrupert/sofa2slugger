import os
import json
import argparse
import urllib.request
import urllib.error
import urllib.parse

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

# 1. Curated, high-quality vertical clips that perfectly match the script storyboards
CURATED_CLIPS = {
    1: {
        "title": "Hand Wraps Preparation (Moody Silhouette)",
        "filename": "Clip_1.mp4",
        "url": "https://videos.pexels.com/video-files/8471307/8471307-hd_1080_1920_25fps.mp4"
    },
    2: {
        "title": "Commercial Gym Space (Fluorescent/Machines)",
        "filename": "Clip_2.mp4",
        "url": "https://videos.pexels.com/video-files/34512250/14623003_1080_1920_30fps.mp4"
    },
    3: {
        "title": "Focused shadowboxing inside a warm-lit room",
        "filename": "Clip_3.mp4",
        "url": "https://videos.pexels.com/video-files/6296168/6296168-hd_1080_1920_25fps.mp4"
    },
    4: {
        "title": "Inserting wireless earbud / phone interaction",
        "filename": "Clip_4.mp4",
        "url": "https://videos.pexels.com/video-files/6857213/6857213-hd_1080_2048_25fps.mp4"
    }
}

# 2. Check if we have a saved API key for custom searches
api_key = None
env_path = os.path.join(project_root, ".env.local")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if "=" in line:
                key, val = line.split("=", 1)
                if key.strip() == "PEXELS_API_KEY":
                    api_key = val.strip()

def download_video(url, output_path):
    print(f"    Downloading from: {url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response, open(output_path, "wb") as out_file:
            meta = response.info()
            file_size = int(meta.get("Content-Length", 0))
            print(f"    File size: {file_size / (1024*1024):.2f} MB")
            
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
                    print(f"    Progress: {percent:.1f}%", end="\r")
            print("\n    [OK] Download complete!")
            return True
    except Exception as e:
        print(f"    [ERROR] Failed to download: {e}")
        return False

def search_pexels(query, api_key):
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=5&orientation=portrait"
    headers = {
        "Authorization": api_key,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode("utf-8"))
            videos = data.get("videos", [])
            if not videos:
                print(f"    No vertical videos found for query: '{query}'")
                return None
            
            video = videos[0]
            video_files = video.get("video_files", [])
            
            selected_file = None
            for vf in video_files:
                if vf.get("file_type") == "video/mp4":
                    width = vf.get("width")
                    if width and 540 <= width <= 1080:
                        selected_file = vf
                        break
            
            if not selected_file and video_files:
                selected_file = video_files[0]
                
            if selected_file:
                return selected_file.get("link")
            return None
    except Exception as e:
        print(f"    [ERROR] Query failed: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Download stock video clips for Sofa2Slugger.")
    parser.add_argument("--mode", choices=["curated", "search"], help="Bypass interactive prompt and choose mode directly")
    args_cli = parser.parse_args()

    print("=================================================================")
    print("         SOFA2SLUGGER: AUTOMATED STOCK VIDEO SOURCER")
    print("=================================================================")
    
    choice = 1
    if args_cli.mode == "curated":
        choice = 1
    elif args_cli.mode == "search":
        choice = 2
    else:
        print("Select download mode:")
        print("1. Download Curated Storyboard Clips (Hand-selected, 100% matching)")
        print("2. Search & Download custom clips (Requires Pexels API key)")
        print("-----------------------------------------------------------------")
        
        choice_str = input("Enter choice (1-2) [Default=1]: ").strip()
        if choice_str == "2":
            choice = 2
        
    if choice == 1:
        print("\nDownloading high-quality, storyboard-matching vertical clips...")
        for num, info in CURATED_CLIPS.items():
            filename = info["filename"]
            title = info["title"]
            output_path = os.path.join(script_dir, filename)
            
            print(f"\n[*] Sourcing Clip {num}: {title} -> {filename}")
            if os.path.exists(output_path):
                print(f"    [OK] File already exists: {filename}. Skipping.")
                continue
                
            download_video(info["url"], output_path)
            
    else:
        # Custom search mode
        global api_key
        if not api_key:
            print("\nTo search and download custom clips, enter your Pexels API Key.")
            print("  Get one free at: https://www.pexels.com/api/ (takes 10s)")
            input_key = input("Paste Pexels API Key: ").strip()
            if not input_key:
                print("No key entered. Aborting.")
                return
            
            # Save key
            try:
                with open(env_path, "a", encoding="utf-8") as f:
                    f.write(f"\nPEXELS_API_KEY={input_key}\n")
                api_key = input_key
                print("API Key saved to .env.local")
            except Exception as e:
                api_key = input_key
                
        print("\nEnter search queries for the 4 video slots:")
        custom_queries = {}
        defaults = {
            1: "boxing wrapping hands",
            2: "gym weights machines",
            3: "boxer shadowboxing",
            4: "using smartphone dark"
        }
        
        for i in range(1, 5):
            q_input = input(f"Query for Clip {i} [Default='{defaults[i]}']: ").strip()
            custom_queries[i] = q_input if q_input else defaults[i]
            
        print("\nStarting custom search & downloads...")
        for num, query in custom_queries.items():
            filename = f"Clip_{num}.mp4"
            output_path = os.path.join(script_dir, filename)
            
            print(f"\n[*] Processing Clip {num} -> {filename}")
            if os.path.exists(output_path):
                print(f"    [OK] File already exists: {filename}. Skipping.")
                continue
                
            print(f"    Searching Pexels for: '{query}'...")
            download_url = search_pexels(query, api_key)
            if download_url:
                print("    [OK] Found video! Downloading...")
                download_video(download_url, output_path)
            else:
                print("    [ERROR] Could not find a suitable clip.")
                
    print("\n=================================================================")
    print("Sourcing run completed. Clips are ready in your marketing folder!")
    print("=================================================================")

if __name__ == "__main__":
    main()
