const fs = require('fs');
const path = require('path');
const { CartesiaClient } = require('@cartesia/cartesia-js');

// --- CONFIGURATION ---
const API_KEY = 'sk_car_MQBmRQym6Knztu9nmV5fTW';
const VANCE_ID = '42b39f37-515f-4eee-8546-73e841679c1d';

const SCRIPT_PATH = path.join(__dirname, '../assets/scripts/manifesto.txt');
const OUTPUT_DIR = path.join(__dirname, '../web/audio/final');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'manifesto.mp3');

// --- INITIALIZATION ---
const client = new CartesiaClient({ apiKey: API_KEY });

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateManifesto() {
    console.log('Reading manifesto script...');
    let text = fs.readFileSync(SCRIPT_PATH, 'utf-8');

    // Clean up headers
    // Remove "M — THE MANIFESTO", "=======", "VANCE"
    // We'll just look for the start of the actual text "This is Sofa to Slugger."
    const startIndex = text.indexOf('This is Sofa to Slugger');
    if (startIndex === -1) {
        console.error('Could not find start of script text.');
        return;
    }

    const cleanText = text.substring(startIndex).trim();
    console.log(`Generating audio for ${cleanText.length} characters...`);

    const tempPath = path.join(__dirname, 'temp_manifesto.mp3');

    try {
        const stream = await client.tts.bytes({
            modelId: "sonic-english",
            voice: {
                mode: "id",
                id: VANCE_ID,
            },
            transcript: cleanText,
            outputFormat: {
                container: "mp3",
                encoding: "mp3",
                sampleRate: 44100,
                bitRate: 128000
            }
        });

        const buffer = await streamToBuffer(stream);
        fs.writeFileSync(OUTPUT_FILE, buffer);
        console.log(`Success! Saved to ${OUTPUT_FILE}`);

    } catch (err) {
        console.error('Generation failed:', err);
    }
}

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

generateManifesto();
