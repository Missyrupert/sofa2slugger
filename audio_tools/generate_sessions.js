const fs = require('fs');
const path = require('path');
const { CartesiaClient } = require('@cartesia/cartesia-js');

// --- CONFIGURATION ---
const API_KEY = 'sk_car_MQBmRQym6Knztu9nmV5fTW';
const VOICE_IDS = {
    VANCE: '42b39f37-515f-4eee-8546-73e841679c1d',
    MAC: '50d6beb4-80ea-4802-8387-6c948fe84208'
};

const SCRIPTS_DIR = path.join(__dirname, '../assets/scripts');
const OUTPUT_DIR = path.join(__dirname, '../web/audio/raw'); // Changed to raw for intermediate files
const MANIFEST_DIR = path.join(__dirname, '../web/audio/manifests');

// --- INITIALIZATION ---
const client = new CartesiaClient({ apiKey: API_KEY });

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(MANIFEST_DIR)) fs.mkdirSync(MANIFEST_DIR, { recursive: true });

// --- MAIN LOGIC ---
async function processSession(sessionFile) {
    console.log(`Processing ${sessionFile}...`);
    const sessionName = path.basename(sessionFile, '.txt');
    const scriptPath = path.join(SCRIPTS_DIR, sessionFile);
    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

    // Parse Script
    const segments = parseScript(scriptContent);
    const manifest = [];

    let segmentIndex = 0;

    for (const segment of segments) {
        if (segment.type === 'speech') {
            const fileName = `${sessionName}_part_${String(segmentIndex).padStart(3, '0')}_${segment.speaker.toLowerCase()}.mp3`;
            const filePath = path.join(OUTPUT_DIR, fileName);

            console.log(`  Generating speech (${segment.speaker}): "${segment.text.substring(0, 30)}..."`);

            // Check if file exists to save credits/time (Simple caching)
            if (fs.existsSync(filePath)) {
                console.log(`    Skipping generation (Cached): ${fileName}`);
            } else {
                await generateSpeech(segment.text, VOICE_IDS[segment.speaker], filePath);
            }

            // Estimate duration or read it? Ideally read it, but for now we just store the path.
            // The mixer will probe the file.
            manifest.push({
                type: 'speech',
                speaker: segment.speaker,
                file: fileName, // Relative to RAW dir
                text: segment.text
            });
            segmentIndex++;

        } else if (segment.type === 'silence') {
            manifest.push({
                type: 'silence',
                duration: segment.duration
            });
        } else if (segment.type === 'event') {
            manifest.push({
                type: 'event',
                name: segment.name
            });
        }
    }

    // Save Manifest
    const manifestPath = path.join(MANIFEST_DIR, `${sessionName}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Saved manifest to ${manifestPath}`);
}

function parseScript(text) {
    const lines = text.split('\n');
    const segments = [];
    let currentSpeaker = null;
    let currentText = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 1. Detect Speaker Change
        if (trimmed.startsWith('VANCE (')) {
            flushText();
            currentSpeaker = 'VANCE';
            continue;
        }
        if (trimmed.startsWith('MAC (')) {
            flushText();
            currentSpeaker = 'MAC';
            continue;
        }

        // 2. Detect Music Gap / Silence (Strict Format)
        // [4s MUSIC GAP — VANCE → MAC] or [2s QUIET PAUSE]
        const silenceMatch = trimmed.match(/\[(\d+)s (MUSIC GAP|QUIET PAUSE)/);
        if (silenceMatch) {
            flushText();
            segments.push({ type: 'silence', duration: parseInt(silenceMatch[1], 10) });
            continue;
        }

        // 3. Detect Events (Bell, Crowd)
        // [BELL — ROUND START]
        if (trimmed.includes('[BELL — ROUND START]')) {
            flushText();
            segments.push({ type: 'event', name: 'BELL_START' });
            continue;
        }
        if (trimmed.includes('[BELL — ROUND END]')) {
            flushText();
            segments.push({ type: 'event', name: 'BELL_END' });
            continue;
        }

        // [CROWD / AMBIENT SOUND FADES IN]
        if (trimmed.includes('[CROWD')) {
            // We can treat this as an event, but often it coincides with Bell. 
            // The prompt says "Crowd ambience fades in AFTER the bell".
            // We'll mark the event location in the sequence.
            flushText();
            if (trimmed.includes('FADES IN')) segments.push({ type: 'event', name: 'CROWD_IN' });
            if (trimmed.includes('FADES OUT')) segments.push({ type: 'event', name: 'CROWD_OUT' });
            continue;
        }


        // 4. Ignore Meta Headers
        if (trimmed.startsWith('SESSION') && (trimmed.includes('THE ROUND') || trimmed.includes('LOCKED'))) continue;
        if (trimmed.match(/^=+/)) continue; // Separator lines

        // 5. Accumulate Speech
        if (currentSpeaker) {
            currentText.push(trimmed);
        }
    }

    flushText(); // Final flush

    function flushText() {
        if (currentText.length > 0 && currentSpeaker) {
            segments.push({ type: 'speech', speaker: currentSpeaker, text: currentText.join(' ') });
            currentText = [];
        }
    }

    return segments;
}

async function generateSpeech(text, voiceId, outputFile) {
    try {
        const stream = await client.tts.bytes({
            modelId: "sonic-english",
            voice: {
                mode: "id",
                id: voiceId,
            },
            transcript: text,
            outputFormat: {
                container: "mp3",
                encoding: "mp3",
                sampleRate: 44100,
                bitRate: 128000
            }
        });

        const buffer = await streamToBuffer(stream);
        fs.writeFileSync(outputFile, buffer);
    } catch (err) {
        console.error(`Error generating speech for ${text.substring(0, 20)}...:`, err);
        throw err;
    }
}

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

// --- EXECUTION ---
(async () => {
    // Process Sessions 2-10
    const files = fs.readdirSync(SCRIPTS_DIR).filter(f => f.startsWith('session') && f !== 'session01.txt' && f.endsWith('.txt'));
    files.sort();
    console.log(`Found ${files.length} scripts to process.`);

    for (const file of files) {
        await processSession(file);
    }
})();
