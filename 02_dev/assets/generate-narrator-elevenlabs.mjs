/**
 * Generate Narrator Audio via ElevenLabs
 * 
 * Usage:
 * export ELEVENLABS_API_KEY="your_key"
 * node generate-narrator-elevenlabs.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// Basic .env parser to support local .env file
const envFile = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  console.log("Loading .env file...");
  const content = fs.readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;

    const parts = line.indexOf('=');
    if (parts !== -1) {
      const key = line.substring(0, parts).trim();
      const val = line.substring(parts + 1).trim().replace(/^["'](.+)["']$/, '$1');
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const VOICE_ID = "B9Az3Pwxoz7W9XqHK8yD";
const MODEL_ID = "eleven_multilingual_v2";
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error("Error: ELEVENLABS_API_KEY environment variable is missing.");
  console.error("Please create a .env file or set the environment variable.");
  process.exit(1);
}

const SCRIPTS_DIR = path.resolve('01_product/audio/narrator/scripts');
const OUTPUT_DIR = path.resolve('01_product/audio/narrator/generated');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all script files
const scripts = fs.readdirSync(SCRIPTS_DIR).filter(f => f.endsWith('.txt'));

if (scripts.length === 0) {
  console.log("No scripts found in " + SCRIPTS_DIR);
  process.exit(0);
}

console.log(`Found ${scripts.length} scripts. Starting generation...`);

async function generateAudio(scriptFile) {
  const text = fs.readFileSync(path.join(SCRIPTS_DIR, scriptFile), 'utf8').trim();
  if (!text) return;

  const outFile = scriptFile.replace('.txt', '.mp3');
  const outPath = path.join(OUTPUT_DIR, outFile);

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    }
  };

  const body = JSON.stringify({
    text: text,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.7,
      similarity_boost: 0.75,
      style: 0
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', d => errorData += d);
        res.on('end', () => reject(new Error(`API Error ${res.statusCode}: ${errorData}`)));
        return;
      }

      const fileStream = fs.createWriteStream(outPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`GENERATED ${outFile}`);
        resolve();
      });
    });

    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
}

async function run() {
  for (const file of scripts) {
    try {
      await generateAudio(file);
    } catch (err) {
      console.error(`FAIL ${file}: ${err.message}`);
    }
  }
}

run();
