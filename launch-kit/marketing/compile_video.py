import os
import shutil
import subprocess
import ctypes.wintypes

def get_desktop_dir():
    CSIDL_DESKTOP = 0
    buf = ctypes.create_unicode_buffer(ctypes.wintypes.MAX_PATH)
    ctypes.windll.shell32.SHGetFolderPathW(None, CSIDL_DESKTOP, None, 0, buf)
    return buf.value

# Resolve directories
script_dir = os.path.dirname(os.path.abspath(__file__))
desktop_dir = get_desktop_dir()
old_s2s_desktop = os.path.join(desktop_dir, "S2S")

# 1. Automatic clean-up of locked Audacity files from Desktop S2S folder
if os.path.exists(old_s2s_desktop):
    print("Detected leftover S2S folder on Desktop. Attempting to clean up files...")
    cleaned_all = True
    for item in os.listdir(old_s2s_desktop):
        src_item = os.path.join(old_s2s_desktop, item)
        dest_item = os.path.join(script_dir, item)
        try:
            if os.path.exists(dest_item):
                os.remove(dest_item)
            shutil.move(src_item, dest_item)
            print(f"Moved leftover file to project: {item}")
        except Exception as e:
            cleaned_all = False
            print(f"Skipping locked/in-use file: {item} (Please close Audacity to release locks)")
    
    if cleaned_all:
        try:
            os.rmdir(old_s2s_desktop)
            print("Successfully cleaned up and removed Desktop S2S folder!")
        except Exception as e:
            pass

# Resolve audio/slide paths relative to this script inside project
voiceover_path = os.path.join(script_dir, "voiceover.mp3")

if not os.path.exists(voiceover_path):
    print("================================================================")
    print("ERROR: Could not find voiceover file at:")
    print(f"  {voiceover_path}")
    print("================================================================")
    print("INSTRUCTIONS:")
    print("1. In Audacity (Tester_Me.aup3), go to File -> Export Audio...")
    print("2. Save the file inside the project directory at:")
    print(f"   {voiceover_path}")
    print("3. Double-click the 'Compile Sofa to Slugger Video.bat' file again.")
    print("================================================================")
    input("Press Enter to close...")
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
    print(f"ERROR: Failed to read audio duration using ffprobe: {e}")
    input("Press Enter to close...")
    exit(1)

print(f"Found voiceover.mp3. Duration: {duration:.2f} seconds.")

s1_dur = 9
s2_dur = 13
s3_dur = 13
s4_dur = duration - (s1_dur + s2_dur + s3_dur)

if s4_dur < 1:
    s4_dur = 5

slide1 = os.path.join(script_dir, "Slide_1_The_Gym_Trap.png")
slide2 = os.path.join(script_dir, "Slide_2_Gym_Pressure.png")
slide3 = os.path.join(script_dir, "Slide_3_Living_Room_Comfort.png")
slide4 = os.path.join(script_dir, "Slide_4_Sofa_To_Slugger_CTA.png")

output_path = os.path.join(script_dir, "Sofa_To_Slugger_Short.mp4")

print("\nCompiling your vertical video using FFmpeg...")
ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-loop", "1", "-t", str(s1_dur), "-i", slide1,
    "-loop", "1", "-t", str(s2_dur), "-i", slide2,
    "-loop", "1", "-t", str(s3_dur), "-i", slide3,
    "-loop", "1", "-t", f"{s4_dur:.2f}", "-i", slide4,
    "-i", voiceover_path,
    "-filter_complex", "[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[v]",
    "-map", "[v]", "-map", "4:a",
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    output_path
]

try:
    subprocess.run(ffmpeg_cmd, check=True)
    print("\n================================================================")
    print("SUCCESS! Video compiled successfully!")
    print(f"Saved: {output_path}")
    print("================================================================")
except subprocess.CalledProcessError as e:
    print(f"\nERROR: FFmpeg compilation failed: {e}")

input("\nPress Enter to close...")
