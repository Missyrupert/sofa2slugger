/**
 * Sofa2Slugger Audio Processing Script (10-Track Progressive System)
 *
 * Creates complete session audio blocks with unique music for each session:
 * - Session content (warmup+coaching merged for 1-4, single file for 5-10)
 * - Vance outro appended seamlessly
 * - Session-specific music fades in, continues through outro, fades out at end
 * - Applies loudness normalization
 *
 * NEW: Each session gets its own unique music track that mirrors user progression
 * Sessions 1-10: Progressive ska/reggae tracks building from sparse to triumphant
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  processedDir: './processed',
  outputDir: './final',
  audioDir: './public/audio',
  musicDir: './public/audio/music', // New: directory for individual session music

  // Timing (in seconds)
  musicFadeInStart: 5,    // When music starts fading in (after session content starts)
  musicFadeInDuration: 3, // Duration of fade-in
  musicTailDuration: 4,   // Music continues after final spoken word
  musicFadeOutDuration: 3, // Duration of fade-out

  // Volume levels (music relative to voice)
  musicVolume: 0.18,        // Standard sessions (18% volume)
  musicVolumeSession10: 0.25, // Session 10: louder music for celebration

  // Target loudness (LUFS)
  targetLoudness: -16,

  // Sessions config - NEW: Each session has its own unique music track
  sessions: [
    { 
      num: 1, 
      source: 'session-1-merged.mp3', 
      musicTrack: 'session-01-music.mp3', 
      outro: 'vance-s01-outro.mp3',
      description: 'The First Step - Sparse, tentative'
    },
    { 
      num: 2, 
      source: 'session-2-merged.mp3', 
      musicTrack: 'session-02-music.mp3', 
      outro: 'vance-s02-outro.mp3',
      description: 'Finding Rhythm - Offbeat emerges'
    },
    { 
      num: 3, 
      source: 'session-3-merged.mp3', 
      musicTrack: 'session-03-music.mp3', 
      outro: 'vance-s03-outro.mp3',
      description: 'Foundation Settles - Groove locks in'
    },
    { 
      num: 4, 
      source: 'session-4-merged.mp3', 
      musicTrack: 'session-04-music.mp3', 
      outro: 'vance-s04-outro.mp3',
      description: 'Adding Tools - Horns enter'
    },
    { 
      num: 5, 
      source: 'session-5.mp3', 
      musicTrack: 'session-05-music.mp3', 
      outro: 'vance-s05-outro.mp3',
      description: 'The Pocket - Rocksteady depth'
    },
    { 
      num: 6, 
      source: 'session-6.mp3', 
      musicTrack: 'session-06-music.mp3', 
      outro: 'vance-s06-outro.mp3',
      description: 'Building Combinations - Call-response'
    },
    { 
      num: 7, 
      source: 'session-7.mp3', 
      musicTrack: 'session-07-music.mp3', 
      outro: 'vance-s07-outro.mp3',
      description: 'Finding Flow - Effortless rhythm'
    },
    { 
      num: 8, 
      source: 'session-8.mp3', 
      musicTrack: 'session-08-music.mp3', 
      outro: 'vance-s08-outro.mp3',
      description: 'Speed & Power - Uptempo intensity'
    },
    { 
      num: 9, 
      source: 'session-9.mp3', 
      musicTrack: 'session-09-music.mp3', 
      outro: 'vance-s09-outro.mp3',
      description: 'The Full Arsenal - Complete sound'
    },
    { 
      num: 10, 
      source: 'session-10.mp3', 
      musicTrack: 'session-10-music.mp3', 
      outro: 'vance-s10-outro.mp3',
      description: 'Victorious - Triumphant finale'
    }
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
 * Process a single session with unique music track
 * Creates a complete session block: session content + outro with continuous music
 */
function processSession(session) {
  const sessionNum = session.num;
  const sourceFile = path.join(CONFIG.processedDir, session.source);
  const outroFile = path.join(CONFIG.audioDir, session.outro);
  const musicFile = path.join(CONFIG.musicDir, session.musicTrack);
  const outputFile = path.join(CONFIG.outputDir, `session-${sessionNum}.mp3`);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SESSION ${sessionNum}: ${session.description}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Source: ${sourceFile}`);
  console.log(`Outro: ${outroFile}`);
  console.log(`Music: ${musicFile}`);

  // Verify all files exist
  if (!fs.existsSync(sourceFile)) {
    console.error(`✗ Source file not found: ${sourceFile}`);
    return false;
  }
  if (!fs.existsSync(outroFile)) {
    console.error(`✗ Outro file not found: ${outroFile}`);
    return false;
  }
  if (!fs.existsSync(musicFile)) {
    console.error(`✗ Music file not found: ${musicFile}`);
    console.log(`  → Generate music using: node generate_s2s_music_suite.js`);
    return false;
  }

  // Get durations
  const sessionDuration = getDuration(sourceFile);
  const outroDuration = getDuration(outroFile);
  const musicDuration = getDuration(musicFile);

  // Total voice duration: session content + outro
  const voiceDuration = sessionDuration + outroDuration;

  // Total output duration: voice + music tail after final word
  const totalDuration = voiceDuration + CONFIG.musicTailDuration;

  // Calculate how many loops needed for music (should be 1 if music is ~180s)
  const loopsNeeded = Math.ceil(totalDuration / musicDuration);

  console.log(`Session content: ${sessionDuration.toFixed(2)}s`);
  console.log(`Outro: ${outroDuration.toFixed(2)}s`);
  console.log(`Total voice: ${voiceDuration.toFixed(2)}s`);
  console.log(`Total with tail: ${totalDuration.toFixed(2)}s`);
  console.log(`Music duration: ${musicDuration.toFixed(2)}s`);
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
  // 3. Loop music, add delay, apply fades and volume
  // 4. Mix voice and music
  // 5. Apply loudness normalization

  const musicTrimDuration = totalDuration - fadeInStart;

  const filterComplex = [
    // Concatenate session content [0] and outro [1]
    `[0:a][1:a]concat=n=2:v=0:a=1[concat]`,

    // Pad concatenated voice to total duration (for music tail)
    `[concat]apad=whole_dur=${totalDuration}[voice]`,

    // Music [2] - loop if needed, trim, delay start, apply fades and volume
    `[2:a]aloop=loop=${loopsNeeded}:size=2e+09,` +
    `atrim=0:${musicTrimDuration},` +
    `adelay=${fadeInStart * 1000}|${fadeInStart * 1000},` +
    `afade=t=in:st=${fadeInStart}:d=${CONFIG.musicFadeInDuration},` +
    `afade=t=out:st=${fadeOutStart}:d=${CONFIG.musicFadeOutDuration},` +
    `volume=${musicVol}[music]`,

    // Mix voice and music (voice at 100%, music at specified volume)
    `[voice][music]amix=inputs=2:duration=first:weights=1 ${musicVol}[mixed]`,

    // Apply loudness normalization
    `[mixed]loudnorm=I=${CONFIG.targetLoudness}:TP=-1.5:LRA=11[out]`
  ].join(';');

  const cmd = `ffmpeg -y -i "${sourceFile}" -i "${outroFile}" -i "${musicFile}" ` +
    `-filter_complex "${filterComplex}" -map "[out]" ` +
    `-c:a libmp3lame -b:a 192k "${outputFile}"`;

  console.log('Processing...');

  try {
    execSync(cmd, { stdio: 'pipe' });

    // Verify output
    const outputDuration = getDuration(outputFile);
    const outputSize = fs.statSync(outputFile).size;
    console.log(`✓ Output: ${outputFile}`);
    console.log(`✓ Duration: ${outputDuration.toFixed(2)}s`);
    console.log(`✓ Size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`✓ Session ${sessionNum} complete!`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing session ${sessionNum}:`, error.message);
    return false;
  }
}

/**
 * Process manifesto (clean, no music)
 */
function processManifesto() {
  console.log('\n' + '='.repeat(60));
  console.log('PROCESSING MANIFESTO');
  console.log('='.repeat(60));

  const sourceFile = path.join(CONFIG.audioDir, 'manifesto.mp3');
  const outputFile = path.join(CONFIG.outputDir, 'manifesto.mp3');

  if (!fs.existsSync(sourceFile)) {
    console.log(`Manifesto source not found: ${sourceFile}`);
    console.log('Skipping manifesto processing.');
    return false;
  }

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
    console.log(`✓ Output: ${outputFile}`);
    console.log(`✓ Duration: ${outputDuration.toFixed(2)}s`);
    console.log(`✓ Size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('✓ Manifesto complete!');
    return true;
  } catch (error) {
    console.error('✗ Error processing manifesto:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('SOFA2SLUGGER AUDIO PROCESSING');
  console.log('10-Track Progressive Music System');
  console.log('='.repeat(60));

  const results = {
    success: [],
    failed: []
  };

  // Process Manifesto (optional)
  const processManifestoFlag = false; // Set to true if you want to process manifesto
  if (processManifestoFlag) {
    if (processManifesto()) {
      results.success.push('Manifesto');
    } else {
      results.failed.push('Manifesto');
    }
  }

  // Process all sessions
  for (const session of CONFIG.sessions) {
    console.log(''); // Add spacing between sessions
    if (processSession(session)) {
      results.success.push(`Session ${session.num}`);
    } else {
      results.failed.push(`Session ${session.num}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successful: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed items:', results.failed.join(', '));
  }

  // List final outputs
  console.log(`\nFinal outputs in ${CONFIG.outputDir}/:`);
  const files = fs.readdirSync(CONFIG.outputDir).sort();
  let totalSize = 0;
  files.forEach(f => {
    const size = fs.statSync(path.join(CONFIG.outputDir, f)).size;
    totalSize += size;
    console.log(`  ${f.padEnd(25)} ${(size / 1024 / 1024).toFixed(2)} MB`);
  });
  console.log(`\nTotal size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('='.repeat(60));
}

main().catch(console.error);
