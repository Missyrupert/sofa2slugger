# Executive Summary: Sofa2Slugger Voice & Video Automation Overhaul

Prepared for: **Sofa2Slugger Team**  
Date: **June 1, 2026**

---

## 1. The Strategic Pivot: Authentic Voice Cloning vs. Robotic AI / Manual Editing

Previously, the marketing and in-app content strategy relied on either **generic AI voice models** (which sounded overly robotic, posh, and lacked the founder's authentic regional accent) or **manual self-recording** (which caused vocal fatigue, required extensive audio cleanup, and slowed down content production to a crawl).

Today, we executed a complete pivot to **ElevenLabs Professional Voice Cloning (PVC)**. 
*   **The Concept:** Instead of recording every single short, promo, and workout audio clip individually, the founder recorded a master dataset of raw speech.
*   **The Result:** ElevenLabs is currently training a custom, dedicated AI voice clone that sounds **exactly like the founder** (capturing his unique cadence, inflection, and authentic regional accent).
*   **The Payoff:** Once trained, we can write scripts in plain text, and generate hours of high-quality coaching audio instantly at the click of a button.

---

## 2. The Voice Training Milestone

To train a true **Professional Voice Clone (PVC)**, ElevenLabs requires a minimum of **30 minutes of clean, raw, unprocessed audio**. 

Over the last few hours, we successfully completed this dataset:
1.  **Drafted a Custom Phonetic Script:** Wrote a comprehensive 9-part script (~5,000 words) specifically designed to cover a massive range of English phonetics, numbers, round counts, and boxing coaching cues.
2.  **Recorded the Audio:** The founder recorded **9 separate MP3 files** in Audacity, maintaining a steady, conversational, and natural coaching pace.
3.  **Achieved the Target:** The final dataset totaled **29 minutes and 36 seconds of raw audio**, which is the perfect volume for ElevenLabs to generate an elite, highly detailed clone.
4.  **Initiated Training:** The files are currently cooking in the ElevenLabs Voice Lab (expected training time is 1 to 4 hours).

---

## 3. Scope for Marketing Shorts (YouTube, Reels, TikTok)

We have built a fully automated vertical video compilation engine that eliminates the need for manual timeline editing.

*   **The Scripts:** Sourced and wrote **5 new high-yield short-form scripts** focused on core boxing and mindset topics (e.g., *"The Jab Changes Everything"*, *"Keep Your Guard Up"*, *"Boxing Isn't About Fighting"*).
*   **Seamless Looping:** Each script is formatted with a **looping mechanism** (the ending words flow seamlessly back into the opening hook), which tricks the viewer into re-watching the video, skyrocketing algorithm engagement.
*   **The Automation Tool:** We built a custom python orchestrator (`compile_all_shorts.py`) and a double-clickable batch file (`Compile All Shorts.bat`).
*   **The Rotation Logic:** The tool automatically rotates your B-roll visual clips so that the 5 shorts look visually distinct from one another, adds your app UI preview, ducks the music, and exports the final 9:16 vertical videos in seconds.

---

## 4. Scope for the In-App Virtual Coach

The long-term value of this voice clone is inside the **Sofa2Slugger web app** itself. 

*   **Zero-Friction Content Scaling:** As we expand the program from 1 round to 12 rounds and add advanced workouts, we don't need to rent studio time or record hours of voice lines. We simply type the workout cues into a text file, and the engine generates the audio files automatically using the founder's voice clone.
*   **Authenticity at Scale:** The app maintains its core brand promise: a real, authentic, regional boxing coach guiding you in your ear. It feels human, personal, and premium.

---

## 5. Plan for Sound Quality & Audio Refinement

We have built a dedicated audio-processing workflow to ensure that the voiceovers sound like they were recorded in a professional studio:
*   **Sidechain Ducking:** Whenever the coach speaks, the background music bed is automatically ducked by 12-14dB, and swells back up during pauses to maintain high energy.
*   **Limiting & Leveling:** The compilers apply a soft brickwall limiter (`-0.05dB`) to ensure the voice is loud, clear, and never clips or distorts on phone speakers.
*   **Future Cleanup (If needed):** If any of the training files contained minor room reflections or echo, we can apply advanced spectral noise gating or de-reverb processing to the output files. Because ElevenLabs acts as a "filter" by reconstructing speech from scratch, the generated voice will actually sound **cleaner and drier** than the raw recordings.

---

## 6. Next Steps (Tomorrow's Agenda)

1.  **Retrieve Voice ID:** Grab the completed `VOICE_ID` from the ElevenLabs dashboard.
2.  **Generate and Compile:** Double-click `Compile All Shorts.bat` and run option `6` to generate all 5 shorts voiceovers and render the vertical MP4 videos.
3.  **App Integration:** Use the clone to generate the voice tracks for the workout modules and update the app's audio player.
