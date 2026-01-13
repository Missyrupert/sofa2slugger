const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

// --- CONSTANTS ---
const MANIFEST_DIR = '../web/audio/manifests';
const RAW_DIR = '../web/audio/raw';
const OUTPUT_DIR = '../web/audio/final'; // Final output
const MUSIC_DIR = '../web/audio/music';
const ASSETS_DIR = '../'; // Root? No, assets are in ../assets or ../web/audio

// Map sessions to music
const SESSION_MUSIC = {
    'session01': 'calm_base.mp3',
    'session02': 'calm_base.mp3',
    'session03': 'focused_base.mp3',
    'session04': 'focused_base.mp3',
    'session05': 'focused_base.mp3',
    'session06': 'intensity_base.mp3',
    'session07': 'intensity_base.mp3',
    'session08': 'intensity_base.mp3',
    'session09': 'intensity_base.mp3',
    'session10': 'session10_base.mp3'
};

const BELL_PATH = '../web/audio/boxing_bell.mp3';
const CROWD_PATH = '../web/audio/crowd_simulated.mp3';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// --- HELPERS ---
function getDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration);
        });
    });
}

// --- MAIN MIXING FUNCTION ---
async function mixSession(sessionName) {
    const finalPath = path.join(OUTPUT_DIR, `${sessionName}.mp3`);
    if (fs.existsSync(finalPath)) {
        console.log(`Skipping ${sessionName} (already exists at ${finalPath})`);
        return;
    }

    console.log(`Mixing ${sessionName}...`);
    const manifestPath = path.join(MANIFEST_DIR, `${sessionName}.json`);
    if (!fs.existsSync(manifestPath)) {
        console.error(`Manifest not found for ${sessionName}`);
        return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const musicFile = path.join(MUSIC_DIR, SESSION_MUSIC[sessionName]);

    // 1. Calculate Timeline & Gather Inputs
    let currentTime = 0;
    const speechInputs = [];
    const events = []; // { name, time, duration }

    // We need to build a single "Voice Stream" first by concatenating speech + silence
    // But fluent-ffmpeg is tricky with mixed concat of files and silence.
    // Easier approach: Generate silent files for gaps? Or use 'anullsrc' in filter.
    // Let's generate temporary silence files for gaps to make concat trivial.

    const concatList = [];

    for (const item of manifest) {
        if (item.type === 'speech') {
            const p = path.join(RAW_DIR, item.file);
            const duration = await getDuration(p);
            concatList.push(p);
            currentTime += duration;
        } else if (item.type === 'silence') {
            const silenceFile = path.join(RAW_DIR, `silence_${item.duration}s.mp3`);
            if (!fs.existsSync(silenceFile)) {
                await generateSilence(item.duration, silenceFile);
            }
            concatList.push(silenceFile);
            currentTime += item.duration;
        } else if (item.type === 'event') {
            events.push({ name: item.name, time: currentTime });
            // Events take 0 time in the flow, they are markers
        }
    }

    const totalDuration = currentTime;
    console.log(`  Total Duration: ${totalDuration.toFixed(2)}s`);

    // 2. Build FFmpeg Command
    // We will do this via a generated complex filter string because it's complex.
    // Inputs:
    // [0] Music (looped)
    // [1] Voice (concatenated)
    // [2] Bell (if needed)
    // [3] Crowd (if needed)

    // Construct Voice Concat File List
    const concatListPath = path.join(RAW_DIR, `${sessionName}_concat.txt`);
    const concatFileContent = concatList.map(f => `file '${path.resolve(f).replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(concatListPath, concatFileContent);

    // Filter Graphs
    let filters = [];
    let inputs = [];

    // Input 0: Music (Looped)
    // We loop the music file to ensure it covers totalDuration
    // ffmpeg -stream_loop -1 -i music.mp3 ...
    // Note: stream_loop must be before input

    // Actually, let's use the node wrapper properly.
    const cmd = ffmpeg();

    // Music Input (0)
    cmd.input(musicFile).inputOptions(['-stream_loop', '-1']);

    // Voice Input (1)
    // We use concat demuxer for the voice track
    cmd.input(concatListPath).inputOptions(['-f', 'concat', '-safe', '0']);

    let audioStreamMap = '[0:a][1:a]'; // Initial map for "Music" and "Voice"

    // Sidechain Logic
    // Duck [0] (Music) when [1] (Voice) is active.
    // filter: [0:a][1:a]sidechaincompress=threshold=0.1:ratio=5:attack=50:release=300[ducked_music];[1:a]asplit[voice_main][voice_sc];
    // Wait, simple sidechain:
    // [1:a]asplit=2[sc_in][voice_out];[0:a][sc_in]sidechaincompress=threshold=0.2:ratio=4:attack=50:release=400[music_out]
    // Then mix [music_out] and [voice_out]

    // Session 10 Logic (Bell/Crowd)
    if (sessionName === 'session10') {
        // Add Bell Input (2)
        cmd.input(BELL_PATH);
        // Add Crowd Input (3)
        cmd.input(CROWD_PATH).inputOptions(['-stream_loop', '-1']);

        // Timestamps for Bell
        const bellStart = events.find(e => e.name === 'BELL_START')?.time || 0;
        const bellEnd = events.find(e => e.name === 'BELL_END')?.time || 0;

        // Logic:
        // 1. Voice Track -> [voice_raw]
        // 2. Music Track -> [music_raw]
        // 3. Crowd Track -> FadeIn at BellStart, FadeOut at BellEnd -> [crowd_trimmed]
        // 4. Bell Track -> Play at BellStart, Play at BellEnd -> [bells_mixed]
        // 5. Mix:
        //    Background = [music_raw] + [crowd_trimmed] (mixed, maybe crowd sidechains music? No, Voice sidechains ALL)
        //    Submix = Background + [bells_mixed]
        //    Final = Sidechain(Submix, Voice) + Voice

        // Let's refine hierarchy:
        // Voice > Bell > Crowd > Music
        // Voice ducks everything?
        // Maybe Voice ducks Music+Crowd. Bell stands out.

        // Filter Construction:
        // [0:a] volume=0.4 [music_vol];
        // [3:a] volume=0.3, adelay=${bellStart*1000}|${bellStart*1000}, afade=t=in:st=${bellStart}:d=5, afade=t=out:st=${bellEnd}:d=5 [crowd_mix];
        // [music_vol][crowd_mix]amix=inputs=2[bg_mix];
        // 
        // [2:a]adelay=${bellStart*1000}|${bellStart*1000},volume=1.0[bell1];
        // [2:a]adelay=${bellEnd*1000}|${bellEnd*1000},volume=1.0[bell2];
        // [bell1][bell2]amix=inputs=2[bells_total];
        //
        // [bg_mix][bells_total]amix=inputs=2[backing_track];
        //
        // [1:a]asplit=2[voice_out][sc_src];
        // [backing_track][sc_src]sidechaincompress=threshold=0.05:ratio=5:attack=50:release=400[backing_ducked];
        //
        // [backing_ducked][voice_out]amix=inputs=2[final]

        filters = [
            // Music Volume
            { filter: 'volume', options: '0.4', inputs: '0:a', outputs: 'music_vol' },

            // Crowd: Delay start, Fade In/Out
            { filter: 'adelay', options: `${bellStart * 1000}|${bellStart * 1000}`, inputs: '3:a', outputs: 'crowd_delayed' },
            // We need to trim crowd to end? Or fading out is enough.
            // afade out
            { filter: 'afade', options: `t=in:st=${bellStart}:d=5`, inputs: 'crowd_delayed', outputs: 'crowd_faded_in' },
            { filter: 'afade', options: `t=out:st=${bellEnd}:d=5`, inputs: 'crowd_faded_in', outputs: 'crowd_mix' },

            // Mix Music + Crowd -> BG
            { filter: 'amix', options: { inputs: 2, duration: 'first' }, inputs: ['music_vol', 'crowd_mix'], outputs: 'bg_mix' },

            // Bells
            { filter: 'adelay', options: `${bellStart * 1000}|${bellStart * 1000}`, inputs: '2:a', outputs: 'bell1' },
            { filter: 'adelay', options: `${bellEnd * 1000}|${bellEnd * 1000}`, inputs: '2:a', outputs: 'bell2' },
            { filter: 'amix', options: { inputs: 2, duration: 'longest' }, inputs: ['bell1', 'bell2'], outputs: 'bells_total' },

            // Backing = BG + Bells (Bells shouldn't be ducked ideally, or maybe they should? Bell is "absolute authority", likely NOT ducked)
            // But Voice > Bell. If Voice talks over Bell, Bell should duck?
            // "Bell is absolute authority" => Bell should NOT be ducked by Voice? Or Voice is dominant?
            // "Voice (Mac and Vance) — always dominant".
            // Let's safe side: Voice ducks EVERYTHING.
            { filter: 'amix', options: { inputs: 2, duration: 'first' }, inputs: ['bg_mix', 'bells_total'], outputs: 'backing_track' },

            // Sidechain
            { filter: 'asplit', options: 2, inputs: '1:a', outputs: ['voice_out', 'sc_src'] },
            { filter: 'sidechaincompress', options: { threshold: 0.1, ratio: 5, attack: 50, release: 400 }, inputs: ['backing_track', 'sc_src'], outputs: 'backing_ducked' },

            // Final Mix
            { filter: 'amix', options: { inputs: 2, duration: 'longest' }, inputs: ['backing_ducked', 'voice_out'], outputs: 'final' }
        ];

    } else {
        // Standard Session (Music + Voice)
        filters = [
            // Music Volume
            { filter: 'volume', options: '0.4', inputs: '0:a', outputs: 'music_vol' },
            // Voice Split
            { filter: 'asplit', options: 2, inputs: '1:a', outputs: ['voice_out', 'sc_src'] },
            // Sidechain
            { filter: 'sidechaincompress', options: { threshold: 0.1, ratio: 5, attack: 50, release: 400 }, inputs: ['music_vol', 'sc_src'], outputs: 'music_ducked' },
            // Final Mix
            { filter: 'amix', options: { inputs: 2, duration: 'longest' }, inputs: ['music_ducked', 'voice_out'], outputs: 'final' }
        ];
    }

    cmd.complexFilter(filters, 'final');

    // Output
    // finalPath is already defined at top of function
    cmd.duration(totalDuration) // Enforce duration to match content
        .save(finalPath)
        .on('error', (err) => console.error(`Error mixing ${sessionName}:`, err))
        .on('end', () => console.log(`Finished ${sessionName} -> ${finalPath}`));
}

// --- HELPER WRAPPER ---
function generateSilence(durationSec, outputFile) {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${durationSec} -q:a 9 -y "${outputFile}"`;
        exec(cmd, (error) => {
            if (error) return reject(error);
            resolve();
        });
    });
}

// --- EXECUTION ---
(async () => {
    // Process all manifests found
    const manifests = fs.readdirSync(MANIFEST_DIR).filter(f => f.endsWith('.json'));
    // manifests.sort();

    // Verify raw files are ready?
    // We assume generate_sessions.js has run or is running. 
    // We might need to wait or just process what's there.
    // For this run, let's process specific list or all.

    for (const m of manifests) {
        const name = path.basename(m, '.json');
        await mixSession(name);
    }
})();
