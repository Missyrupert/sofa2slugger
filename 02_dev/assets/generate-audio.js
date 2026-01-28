const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_car_BBv8gbzcjKAPnfsCw11UbE';
const VOICE_ID = 'c99d36f3-5ffd-4253-803a-535c1bc9c306';
const OUTPUT_DIR = path.join('C:', 'dev', 'sofa2slugger', 'S2S AUDIO');

const audioFiles = [
  {
    filename: 'vance-welcome.mp3',
    text: `Welcome to Sofa to Slugger.

This isn't about performance. It's not about becoming a fighter. It's about permission—permission to move, to take up space, to build discipline through something purposeful.

Ten sessions. Each one builds on the last. Session one is free. You'll learn the foundation—the one-two combination that every boxer in history has relied on. After that, sessions two through ten are yours for nine pounds ninety-nine. One payment. Lifetime access.

Here's how it works: I'll introduce each session and close it out. In between, you'll hear from your coach. He'll guide you through a warm-up, then the session itself. No hype. No performance pressure. Just clear instruction.

This is a beginner's program. If you've never thrown a punch, you're in the right place. If you haven't exercised in years, you're in the right place. Listen to your body. The warm-ups aren't optional—they protect you. If something hurts, stop. This is about building something sustainable, not proving anything to anyone.

Your data is yours. We don't sell it. We don't share it. You pay once, you train as long as you like.

Session one starts now. After that, you'll find the payment link in the menu. Ten sessions. Sofa to slugger.

Let's begin.`
  },
  {
    filename: 'vance-s01-intro.mp3',
    text: `Session one. The foundation.

Everything in boxing comes back to this: the one-two. Jab, cross. It's the first combination you learn, and the last one you'll ever stop using.

You're not here to perform. You're here to learn. Your coach will take you through a warm-up, then teach you the stance, the guard, and that one-two. Move at your own pace. There's no timer on this.

This is where it starts.`
  },
  {
    filename: 'vance-s01-outro.mp3',
    text: `That's session one.

You've learned the stance. The guard. The one-two. That's the foundation of everything that follows.

If you're ready to keep going, session two is waiting. You'll find the payment link in the menu. One payment. Sessions two through ten. Lifetime access.

See you in session two.`
  },
  {
    filename: 'vance-s02-intro.mp3',
    text: `Session two. Movement.

You've got the one-two. Now we add footwork. Boxing isn't static. You move forward, you move back, you pivot. Your coach will show you how to stay balanced while you move.

This is where it starts to feel like boxing.`
  },
  {
    filename: 'vance-s02-outro.mp3',
    text: `That's session two.

You're moving now. Footwork and punches, working together. Keep that rhythm.

Session three is next. See you there.`
  },
  {
    filename: 'vance-s03-intro.mp3',
    text: `Session three. Defense.

You've been learning to punch. Now you learn to not get punched. Slipping, rolling, keeping your guard tight. Your coach will show you how to move your head, how to stay protected.

Defense isn't cowardice. It's intelligence.`
  },
  {
    filename: 'vance-s03-outro.mp3',
    text: `Session three, done.

You're not just throwing punches anymore—you're defending yourself. That changes everything.

Session four is waiting.`
  },
  {
    filename: 'vance-s04-intro.mp3',
    text: `Session four. The hook.

You've got the jab and the cross. Now we add power from the side. The hook comes from your hips, your core, your legs. Your coach will break it down.

This is where it gets serious.`
  },
  {
    filename: 'vance-s04-outro.mp3',
    text: `Session four, complete.

You've added the hook. Three punches now. The combinations are starting to open up.

See you in session five.`
  },
  {
    filename: 'vance-s05-intro.mp3',
    text: `Session five. Halfway there.

You've built the foundation. Now we refine it. Your coach will work on sharpening what you've learned—cleaner punches, tighter defense, smoother movement.

Most people quit before they get here. You didn't.`
  },
  {
    filename: 'vance-s05-outro.mp3',
    text: `That's five sessions.

You're halfway through. You're not the same person who started this.

Session six is next. Let's keep going.`
  },
  {
    filename: 'vance-s06-intro.mp3',
    text: `Session six. The uppercut.

Another weapon. The uppercut comes from below, drives upward. It's a close-range punch, and your coach will show you when and how to use it.

Your arsenal is growing.`
  },
  {
    filename: 'vance-s06-outro.mp3',
    text: `Session six, done.

Four punches. Movement. Defense. You're building something real here.

Session seven is waiting.`
  },
  {
    filename: 'vance-s07-intro.mp3',
    text: `Session seven. Combinations.

You've got the tools. Now we put them together. Jab-cross-hook. Hook-uppercut. Your coach will show you how to flow from one punch to the next without thinking.

This is where it clicks.`
  },
  {
    filename: 'vance-s07-outro.mp3',
    text: `Session seven, complete.

You're not drilling individual punches anymore. You're combining them. That's the shift.

Three more sessions. See you in session eight.`
  },
  {
    filename: 'vance-s08-intro.mp3',
    text: `Session eight. Conditioning.

You've been learning technique. Now we add intensity. Your coach will push the pace, string together longer combinations, keep you moving. This is where your body learns to sustain the work.

You're ready for this.`
  },
  {
    filename: 'vance-s08-outro.mp3',
    text: `Session eight, done.

You just worked harder than you have in any session so far. Your body is adapting. That's the point.

Two left. Session nine is next.`
  },
  {
    filename: 'vance-s09-intro.mp3',
    text: `Session nine. Flow.

Everything you've learned—footwork, punches, defense, combinations—now we put it all together and let it flow. Your coach will guide you, but the rhythm is yours.

This is what it feels like when it all comes together.`
  },
  {
    filename: 'vance-s09-outro.mp3',
    text: `Session nine, complete.

You moved like someone who knows what they're doing. Because you do.

One session left. Let's finish this.`
  },
  {
    filename: 'vance-s10-intro.mp3',
    text: `Session ten. The final round.

This is it. Everything you've built over nine sessions—your coach will put it all into one final workout. You'll move, you'll punch, you'll defend, you'll flow.

You started on a sofa. Look at you now.`
  },
  {
    filename: 'vance-s10-outro.mp3',
    text: `That's ten sessions. Sofa to Slugger.

You're not a beginner anymore. You've built discipline, movement, and a foundation that will serve you as long as you want it to.

This isn't the end. This is where you decide what comes next. But you've earned this moment.

Well done.`
  }
];

function generateAudio(file) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(OUTPUT_DIR, file.filename);

    const data = JSON.stringify({
      model_id: 'sonic-english',
      transcript: file.text,
      voice: { mode: 'id', id: VOICE_ID },
      output_format: { container: 'mp3', sample_rate: 44100, bit_rate: 128000 },
      language: 'en'
    });

    const req = https.request({
      hostname: 'api.cartesia.ai',
      path: '/tts/bytes',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Cartesia-Version': '2024-11-13',
        'Content-Type': 'application/json'
      }
    }, res => {
      if (res.statusCode !== 200) {
        let error = '';
        res.on('data', chunk => error += chunk);
        res.on('end', () => reject(new Error(`${file.filename}: ${res.statusCode} - ${error}`)));
        return;
      }

      const writeStream = fs.createWriteStream(outputPath);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        const stats = fs.statSync(outputPath);
        console.log(`✓ ${file.filename} (${Math.round(stats.size/1024)}KB)`);
        resolve();
      });
      writeStream.on('error', reject);
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`Generating ${audioFiles.length} audio files...\n`);

  for (const file of audioFiles) {
    try {
      await generateAudio(file);
      // Small delay between requests to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`✗ ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
