/**
 * Sofa2Slugger Audio Processing Script
 *
 * Creates complete session audio blocks:
 * - Session content (warmup+coaching merged for 1-4, single file for 5-10)
 * - Vance outro appended seamlessly
 * - Music fades in after session starts, continues through outro, fades out at end
 * - Applies loudness normalization
 *
 * Music Bed Assignments:
 * - Sessions 1-4: start_music_bed.mp3 (Music Bed A)
 * - Sessions 5-7: middle-music-bed.mp3 (Music Bed B)
 * - Sessions 8-10: final_music_bed.mp3 (Music Bed C)
 */

const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  processedDir: './processed',
  outputDir: './final',
  audioDir: './public/audio',

  // Music bed files
  musicBeds: {
    A: 'start_music_bed.mp3',      // Sessions 1-4
    B: 'middle-music-bed.mp3',     // Sessions 5-7
    C: 'final_music_bed.mp3'       // Sessions 8-10
  },

  // Timing (in seconds)
  musicFadeInStart: 5,    // When music starts fading in (after session content starts)
  musicFadeInDuration: 3, // Duration of fade-in
  musicTailDuration: 4,   // Music continues after final spoken word
  musicFadeOutDuration: 3, // Duration of fade-out

  // Volume levels (music relative to voice)
  musicVolume: 0.18,        // Standard sessions (18% volume)
  musicVolumeSession10: 0.12, // Session 10 lower music

  // Target loudness (LUFS)
  targetLoudness: -16,

  // Sessions config - includes outro file for each session
  sessions: [
    { num: 1, source: 'session-1-merged.mp3', musicBed: 'A', outro: 'vance-s01-outro.mp3' },
    { num: 2, source: 'session-2-merged.mp3', musicBed: 'A', outro: 'vance-s02-outro.mp3' },
    { num: 3, source: 'session-3-merged.mp3', musicBed: 'A', outro: 'vance-s03-outro.mp3' },
    { num: 4, source: 'session-4-merged.mp3', musicBed: 'A', outro: 'vance-s04-outro.mp3' },
    { num: 5, source: 'session-5.mp3', musicBed: 'B', outro: 'vance-s05-outro.mp3' },
    { num: 6, source: 'session-6.mp3', musicBed: 'B', outro: 'vance-s06-outro.mp3' },
    { num: 7, source: 'session-7.mp3', musicBed: 'B', outro: 'vance-s07-outro.mp3' },
    { num: 8, source: 'session-8.mp3', musicBed: 'C', outro: 'vance-s08-outro.mp3' },
    { num: 9, source: 'session-9.mp3', musicBed: 'C', outro: 'vance-s09-outro.mp3' },
    { num: 10, source: 'session-10.mp3', musicBed: 'C', outro: 'vance-s10-outro.mp3' }
  ]
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

/**
 * Get audio duration in seconds
 */
function getDuration(filePath) {
  const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
  const result = execSync(cmd, { encoding: 'utf8' }).trim();
  return parseFloat(result);
}

/**
 * Process a single session with music bed
 * Creates a complete session block: session content + outro with continuous music
 */
function processSession(session) {
  const sessionNum = session.num;
  const sourceFile = path.join(CONFIG.processedDir, session.source);
  const outroFile = path.join(CONFIG.audioDir, session.outro);
  const musicBedFile = path.join(CONFIG.audioDir, CONFIG.musicBeds[session.musicBed]);
  const outputFile = path.join(CONFIG.outputDir, `session-${sessionNum}.mp3`);

  console.log(`\n=== Processing Session ${sessionNum} ===`);
  console.log(`Source: ${sourceFile}`);
  console.log(`Outro: ${outroFile}`);
  console.log(`Music: ${musicBedFile}`);

  // Get durations
  const sessionDuration = getDuration(sourceFile);
  const outroDuration = getDuration(outroFile);
  const musicBedDuration = getDuration(musicBedFile);

  // Total voice duration: session content + outro
  const voiceDuration = sessionDuration + outroDuration;

  // Total output duration: voice + music tail after final word
  const totalDuration = voiceDuration + CONFIG.musicTailDuration;

  // Calculate how many loops needed for music bed
  const loopsNeeded = Math.ceil(totalDuration / musicBedDuration);

  console.log(`Session content: ${sessionDuration.toFixed(2)}s`);
  console.log(`Outro: ${outroDuration.toFixed(2)}s`);
  console.log(`Total voice: ${voiceDuration.toFixed(2)}s`);
  console.log(`Total with tail: ${totalDuration.toFixed(2)}s`);
  console.log(`Music loops needed: ${loopsNeeded}`);

  // Music volume for this session
  const musicVol = sessionNum === 10 ? CONFIG.musicVolumeSession10 : CONFIG.musicVolume;

  // Calculate fade timing
  const fadeInStart = CONFIG.musicFadeInStart;
  const fadeInEnd = fadeInStart + CONFIG.musicFadeInDuration;
  const fadeOutStart = totalDuration - CONFIG.musicFadeOutDuration;
  const fadeOutEnd = totalDuration;

  console.log(`Music fade-in: ${fadeInStart}s - ${fadeInEnd}s`);
  console.log(`Music fade-out: ${fadeOutStart.toFixed(2)}s - ${fadeOutEnd.toFixed(2)}s`);
  console.log(`Music volume: ${(musicVol * 100).toFixed(0)}%`);

  // Build FFmpeg filter complex
  // 1. Concatenate session content + outro
  // 2. Pad concatenated voice to total duration (for music tail)
  // 3. Loop music bed, add delay, apply fades and volume
  // 4. Mix voice and music
  // 5. Apply loudness normalization

  // Music needs extra length to account for fade-out at the end
  const musicTrimDuration = totalDuration - fadeInStart;

  const filterComplex = [
    // Concatenate session content [0] and outro [1]
    `[0:a][1:a]concat=n=2:v=0:a=1[concat]`,

    // Pad concatenated voice to total duration (for music tail)
    `[concat]apad=whole_dur=${totalDuration}[voice]`,

    // Music bed [2] - loop, trim, delay start, apply fades and volume
    `[2:a]aloop=loop=${loopsNeeded}:size=2e+09,` +
    `atrim=0:${musicTrimDuration},` +
    `adelay=${fadeInStart * 1000}|${fadeInStart * 1000},` +
    `afade=t=in:st=${fadeInStart}:d=${CONFIG.musicFadeInDuration},` +
    `afade=t=out:st=${fadeOutStart}:d=${CONFIG.musicFadeOutDuration},` +
    `volume=${musicVol}[music]`,

    // Mix voice and music
    `[voice][music]amix=inputs=2:duration=first:weights=1 0.8[mixed]`,

    // Apply loudness normalization
    `[mixed]loudnorm=I=${CONFIG.targetLoudness}:TP=-1.5:LRA=11[out]`
  ].join(';');

  const cmd = `ffmpeg -y -i "${sourceFile}" -i "${outroFile}" -i "${musicBedFile}" ` +
    `-filter_complex "${filterComplex}" -map "[out]" ` +
    `-c:a libmp3lame -b:a 192k "${outputFile}"`;

  console.log('Processing...');

  try {
    execSync(cmd, { stdio: 'pipe' });

    // Verify output
    const outputDuration = getDuration(outputFile);
    const outputSize = fs.statSync(outputFile).size;
    console.log(`Output: ${outputFile}`);
    console.log(`Duration: ${outputDuration.toFixed(2)}s`);
    console.log(`Size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Session ${sessionNum} complete!`);
    return true;
  } catch (error) {
    console.error(`Error processing session ${sessionNum}:`, error.message);
    return false;
  }
}

/**
 * Process manifesto (clean, no music)
 */
function processManifesto() {
  console.log('\n=== Processing Manifesto ===');

  const sourceFile = path.join(CONFIG.audioDir, 'Manifesto');
  const outputFile = path.join(CONFIG.outputDir, 'manifesto.mp3');

  const duration = getDuration(sourceFile);
  console.log(`Source: ${sourceFile}`);
  console.log(`Duration: ${duration.toFixed(2)}s`);

  // Apply only loudness normalization - no music, clean dry vocal
  const cmd = `ffmpeg -y -i "${sourceFile}" ` +
    `-af "loudnorm=I=${CONFIG.targetLoudness}:TP=-1.5:LRA=11" ` +
    `-c:a libmp3lame -b:a 192k "${outputFile}"`;

  try {
    execSync(cmd, { stdio: 'pipe' });

    const outputDuration = getDuration(outputFile);
    const outputSize = fs.statSync(outputFile).size;
    console.log(`Output: ${outputFile}`);
    console.log(`Duration: ${outputDuration.toFixed(2)}s`);
    console.log(`Size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('Manifesto complete!');
    return true;
  } catch (error) {
    console.error('Error processing manifesto:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(50));
  console.log('SOFA2SLUGGER AUDIO PROCESSING');
  console.log('='.repeat(50));

  const results = {
    success: [],
    failed: []
  };

  // Process Manifesto first
  if (processManifesto()) {
    results.success.push('Manifesto');
  } else {
    results.failed.push('Manifesto');
  }

  // Process all sessions
  for (const session of CONFIG.sessions) {
    if (processSession(session)) {
      results.success.push(`Session ${session.num}`);
    } else {
      results.failed.push(`Session ${session.num}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('PROCESSING COMPLETE');
  console.log('='.repeat(50));
  console.log(`Successful: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed items:', results.failed.join(', '));
  }

  // List final outputs
  console.log('\nFinal outputs in ./final/:');
  const files = fs.readdirSync(CONFIG.outputDir).sort();
  files.forEach(f => {
    const size = fs.statSync(path.join(CONFIG.outputDir, f)).size;
    console.log(`  ${f} (${(size / 1024 / 1024).toFixed(2)} MB)`);
  });
}

main().catch(console.error);
