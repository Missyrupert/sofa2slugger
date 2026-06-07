import os
import json
import urllib.request
import urllib.error

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

# 1. Parse .env.local to get ElevenLabs config
api_key = None
voice_id = None
model_id = "eleven_multilingual_v2"

env_path = os.path.join(project_root, ".env.local")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                if key.strip() == "ELEVENLABS_API_KEY":
                    api_key = val.strip()
                elif key.strip() == "ELEVENLABS_COACH_VOICE_ID":
                    voice_id = val.strip()
                elif key.strip() == "ELEVENLABS_MODEL_ID":
                    model_id = val.strip()

if not api_key:
    print("ERROR: ELEVENLABS_API_KEY not found in .env.local")
    exit(1)

# Default to George/Marcus coach voice if ID is missing
if not voice_id:
    voice_id = "waye9U5Y78f4YaHwzOJa"

print(f"ElevenLabs Key Loaded: {api_key[:8]}...")
print(f"Voice ID: {voice_id}")
print(f"Model ID: {model_id}")

# The Promo Script
promo_text = (
    "The hardest part of boxing isn't the punching. "
    "It's walking into a room full of people and feeling like you don't belong. "
    "So we built a bridge. No mirrors. No cameras. No audience. "
    "Just a professional trainer in your ear, guiding your rhythm, building your stance. "
    "Start your private training today. Try Round 1 free at Sofa two Slugger dot com."
)

url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": api_key
}

data = {
    "text": promo_text,
    "model_id": model_id,
    "voice_settings": {
        "stability": 0.75,
        "similarity_boost": 0.85,
        "style": 0.0,
        "use_speaker_boost": True
    }
}

req_data = json.dumps(data).encode("utf-8")
req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")

print("\nGenerating voiceover via ElevenLabs API...")
try:
    with urllib.request.urlopen(req) as response:
        audio_content = response.read()
        output_path = os.path.join(script_dir, "promo_voiceover.mp3")
        with open(output_path, "wb") as out_f:
            out_f.write(audio_content)
        print(f"SUCCESS! Saved voiceover to: {output_path}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error calling ElevenLabs: {e}")
