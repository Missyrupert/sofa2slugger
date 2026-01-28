/**
 * Assemble Final Sessions (Cut Old Narrator -> Stitch New Narrator)
 * 
 * Logic:
 * 1. For each session:
 *    - Identify Legacy Source (s1_full or session-X-complete)
 *    - Extract Coach Body by cutting exact Vance Intro/Outro durations
 *    - Concatenate (N-Intro + Coach Body + N-Outro)
 * 2. Save to /01_product/audio/final/
 * 3. Move Legacy Source to /01_product/audio/archive/legacy_narrator/
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const DIRS = {
    legacy: '01_product/audio', // Source of complete files
    narrator: '01_product/audio/narrator/generated',
    output: '01_product/audio/final',
    archive: '01_product/audio/archive/legacy_narrator'
};

const SESSIONS = [
    { id: '01', source: 's1_full.mp3', introDur: 24.790188, outroDur: 17.580375 },
    { id: '02', source: 'session-2-complete.mp3', introDur: 12.408125, outroDur: 10.422813 },
    { id: '03', source: 'session-3-complete.mp3', introDur: 14.445688, outroDur: 8.907750 },
    { id: '04', source: 'session-4-complete.mp3', introDur: 12.512625, outroDur: 8.150188 },
    { id: '05', source: 'session-5-complete.mp3', introDur: 13.688125, outroDur: 7.471000 },
    { id: '06', source: 'session-6-complete.mp3', introDur: 11.624438, outroDur: 8.097938 },
    { id: '07', source: 'session-7-complete.mp3', introDur: 12.747750, outroDur: 9.639125 },
    { id: '08', source: 'session-8-complete.mp3', introDur: 14.184438, outroDur: 9.508563 },
    { id: '09', source: 'session-9-complete.mp3', introDur: 14.524063, outroDur: 8.489750 },
    { id: '10', source: 'session-10-complete.mp3', introDur: 14.733063, outroDur: 14.497938 }
];

// Ensure dirs exist
Object.values(DIRS).forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

/**
 * Get accurate duration using ffprobe
 */
function getDuration(filePath) {
    try {
        const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
        const res = execSync(cmd, { encoding: 'utf8' }).trim();
        return parseFloat(res);
    } catch (e) {
        console.error(`Error getting duration for ${filePath}`);
        return 0;
    }
}

/**
 * Cut the body out of the legacy file
 */
function extractBody(session) {
    const sourcePath = path.join(DIRS.legacy, session.source);
    const tempBodyPath = path.join(DIRS.legacy, `session-${session.id}-body-temp.mp3`);

    console.log(`[S${session.id}] Extracting Body: ${session.source}`);

    // Calculate cut points
    const totalDur = getDuration(sourcePath);
    if (!totalDur) throw new Error("Could not get duration");

    // Start after Intro, Duration = Total - Intro - Outro
    const start = session.introDur;
    const bodyDur = totalDur - session.introDur - session.outroDur;

    // Safety check
    if (bodyDur <= 0) throw new Error(`Invalid body duration: ${bodyDur}s`);

    // ffmpeg cut command (stream copy to preserve quality)
    // Using -ss before -i for input seeking (fast), but re-encoding might be needed if precision issues arises with copy. 
    // However, -c copy is strict requirement "Do NOT re-encode unless necessary".
    // We will use precise seeking output: ffmpeg -i IN -ss START -t DUR -c copy OUT

    const cmd = `ffmpeg -y -hide_banner -loglevel error -i "${sourcePath}" -ss ${start} -t ${bodyDur} -c copy "${tempBodyPath}"`;
    execSync(cmd);

    return tempBodyPath;
}

/**
 * Stitch final file
 */
function stitchSession(session, bodyPath) {
    const nIntro = path.join(DIRS.narrator, `N-s${session.id}-intro.mp3`);
    const nOutro = path.join(DIRS.narrator, `N-s${session.id}-outro.mp3`);
    const finalPath = path.join(DIRS.output, `session-${session.id}-final.mp3`);

    console.log(`[S${session.id}] Stitching: Intro + Body + Outro -> ${path.basename(finalPath)}`);

    if (!fs.existsSync(nIntro)) throw new Error(`Missing intro: ${nIntro}`);
    if (!fs.existsSync(nOutro)) throw new Error(`Missing outro: ${nOutro}`);

    // Create a temporary list file for ffmpeg concat demuxer
    // Note: Concat demuxer requires same codec/params. ElevenLabs (MP3) + Extract (MP3).
    // If param mismatch (e.g. sample rate), this fails. Re-encode is safer.
    // User Rule: "Do NOT re-encode unless necessary". 
    // Mismatched sample rates (44.1k vs 48k) makes re-encode NECESSARY.

    // We will use the concat FILTER which handles re-encoding automatically to common format.
    // This creates a robust output.
    const cmd = `ffmpeg -y -hide_banner -loglevel error -i "${nIntro}" -i "${bodyPath}" -i "${nOutro}" -filter_complex "[0:a][1:a][2:a]concat=n=3:v=0:a=1[out]" -map "[out]" -q:a 2 "${finalPath}"`;

    execSync(cmd);
    return finalPath;
}

/**
 * Archive Legacy File
 */
function archiveLegacy(session) {
    const sourcePath = path.join(DIRS.legacy, session.source);
    const destPath = path.join(DIRS.archive, session.source);

    console.log(`[S${session.id}] Archiving: ${session.source}`);
    fs.renameSync(sourcePath, destPath);
}

// --- MAIN LOOP ---
async function run() {
    console.log("=== STARTING SESSION ASSEMBLY ===\n");

    for (const session of SESSIONS) {
        try {
            // 1. Extract
            const bodyPath = extractBody(session);

            // 2. Stitch
            stitchSession(session, bodyPath);

            // 3. Cleanup Temp Body
            if (fs.existsSync(bodyPath)) fs.unlinkSync(bodyPath);

            // 4. Archive (Only do this after success)
            archiveLegacy(session);

            console.log(`[S${session.id}] DONE.\n`);

        } catch (e) {
            console.error(`[S${session.id}] FAILED: ${e.message}\n`);
        }
    }

    console.log("=== ASSEMBLY COMPLETE ===");
}

run();
