import os
import json
import argparse
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

# 2. Define the 5 Shorts Scripts (Looping format)
SHORTS_SCRIPTS = {
    1: {
        "title": "The Jab Changes Everything",
        "text": (
            "Most people who want to learn boxing make the same mistake, they think the jab is just a weak punch. "
            "But the jab isn't powerful. It's important. "
            "In boxing, the jab is your measuring stick. It disrupts their rhythm, blinds their vision, and creates the momentum "
            "for your knockout power. In life, progress works the exact same way. You don't need a massive, life-altering change today. "
            "You just need to throw one small, consistent action. One walk outside. One page read. One round of private movement in your living room. "
            "The massive breakthroughs are built on tiny, daily habits. Start your private shadowboxing training today at Sofa two Slugger dot com."
        )
    },
    2: {
        "title": "Keep Your Guard Up",
        "text": (
            "Keeping your guard up isn't about fear. It's about strategy. "
            "In the ring, your guard keeps you safe from unnecessary damage so you can stay in the fight and find your opening. "
            "In life, personal boundaries do the exact same thing. Saying no to negativity, protecting your evening, and choosing your battles "
            "isn't defensive—it's how you win. You cannot build a better future if you are constantly taking hits from things that "
            "should never have reached you in the first place. You protect your space. Try your first round of private coaching completely free at Sofa two Slugger dot com."
        )
    },
    3: {
        "title": "Boxing Isn't About Fighting",
        "text": (
            "The biggest misconception about boxing? That it's about fighting. "
            "But real boxing is the art of avoiding damage, not causing it. It is footwork, head movement, and spatial awareness. "
            "It's slipping a straight punch by two inches and letting their momentum carry them away. "
            "In life, you don't win by fighting every battle or reacting to every critic. You win by slipping the noise, "
            "rolling under the drama, and keeping your eyes forward. True strength is controlling the space. Learn Western boxing mechanics in private at Sofa two Slugger dot com."
        )
    },
    4: {
        "title": "You Don't Need Confidence",
        "text": (
            "Confidence comes after action, not before it. "
            "Nobody walks into their very first workout feeling like a champion. You feel slow, awkward, and self-conscious. That is normal. "
            "The confidence isn't a requirement to start; it is the byproduct of standing up, putting your headphones in, and hitting play. "
            "You don't wait until you are ready to take action. You take action so you can become ready. "
            "Every champion started as a nervous beginner. Take your first step in private today. Try Round 1 free at Sofa two Slugger dot com."
        )
    },
    5: {
        "title": "Every Champion Looked Silly Once",
        "text": (
            "Every champion looked silly once. "
            "The first time you throw a hook, it will feel clumsy. The first time you pivot, you will lose your balance. "
            "That awkwardness is the cost of admission for growth. Most people quit because they are afraid of looking foolish "
            "in front of an audience. That is why private training is so powerful. In your living room, there are no mirrors, "
            "no cameras, and no crowd. You have the permission to make mistakes, look silly, and learn in the quiet. "
            "You have to embrace the awkward stage today, it's the only path to progress. Start your private boxing journey at Sofa two Slugger dot com."
        )
    }
}

def main():
    parser = argparse.ArgumentParser(description="Generate voiceovers for Sofa2Slugger marketing shorts using ElevenLabs.")
    parser.add_argument("--short", type=int, choices=[1, 2, 3, 4, 5], required=True, help="Short script number (1 to 5)")
    parser.add_argument("--voice_id", help="Override ELEVENLABS_COACH_VOICE_ID from .env.local")
    args = parser.parse_args()

    selected_voice_id = args.voice_id or voice_id
    
    if not api_key:
        print("ERROR: ELEVENLABS_API_KEY not found in .env.local")
        exit(1)

    if not selected_voice_id:
        print("WARNING: No ELEVENLABS_COACH_VOICE_ID found in .env.local. Falling back to default coach voice (George).")
        selected_voice_id = "waye9U5Y78f4YaHwzOJa"

    short_info = SHORTS_SCRIPTS[args.short]
    print(f"\n--- Selected Short {args.short}: {short_info['title']} ---")
    print(f"Script Text:\n{short_info['text']}\n")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice_id}"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }

    data = {
        "text": short_info["text"],
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.70,
            "similarity_boost": 0.85,
            "style": 0.0,
            "use_speaker_boost": True
        }
    }

    req_data = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")

    print("Generating voiceover via ElevenLabs...")
    output_filename = f"short_{args.short}_voiceover.mp3"
    output_path = os.path.join(script_dir, output_filename)

    try:
        with urllib.request.urlopen(req) as response:
            audio_content = response.read()
            with open(output_path, "wb") as out_f:
                out_f.write(audio_content)
            print(f"SUCCESS! Saved short voiceover to: {output_path}")
            print(f"You can now run: python compile_generic_short.py --voiceover {output_filename} --clips Clip_1.mp4 Clip_2.mp4 Clip_3.mp4 --screenshot Clip_4.png --output Short_{args.short}.mp4")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error calling ElevenLabs: {e}")

if __name__ == "__main__":
    main()
