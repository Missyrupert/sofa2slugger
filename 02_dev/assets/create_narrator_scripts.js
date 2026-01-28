const fs = require('fs');
const path = require('path');

const dir = '01_product/audio/narrator/scripts';

const scripts = {
    'N-s01-intro.txt': `Welcome to Session 1. This is where we begin.
Today is about the Stance. It is the foundation of everything you will do in boxing.
You need clear space. You need to be able to move your feet.
If you are ready, stand tall. Let's work.`,

    'N-s01-outro.txt': `Session 1 is complete. You have your stance. You have broken the inertia.
That was the hardest step. The decision to start.
If you enjoyed this, Session 2 introduces the Jab—the most important punch in boxing.
To continue, unlock the full programme. A single payment. Yours forever.
Move the body. The mind follows.
Stay safe, and take care.`,

    'N-s02-intro.txt': `Welcome to Session 2.
You have your stance. Now we add the Lead Hand. The Jab.
The Jab is your range finder. Your first line of attack and defense.
Keep your chin down. Eyes forward.
Let's begin.`,

    'N-s02-outro.txt': `Session 2 is done. You are finding your range.
Keep practicing that snap.
Next, in Session 3, we bring in the Rear Hand. The Cross. The power shot.
Rest well.
Stay safe, and take care.`,

    'N-s03-intro.txt': `Welcome to Session 3.
You have the Jab. Now we add the Cross.
This is your power hand. It comes from the hip. From the ground up.
Focus on the rotation.
Let's work.`,

    'N-s03-outro.txt': `Session 3 complete. You now have the fundamental one-two combination.
Jab. Cross. The bread and butter of boxing.
In Session 4, we will introduce circular punches. The Hooks.
Recalibrate.
Stay safe, and take care.`,

    'N-s04-intro.txt': `Welcome to Session 4.
You know straight punches. Now we learn to go around the guard.
The Hook. Left and Right.
It requires a different kind of connection through the core.
Stay balanced.
Let's begin.`,

    'N-s04-outro.txt': `Session 4 is done. Your arsenal is growing.
You can strike straight, and you can strike from the side.
Next, Session 5. We look upwards. The Uppercuts.
Hydrate and rest.
Stay safe, and take care.`,

    'N-s05-intro.txt': `Welcome to Session 5.
The Uppercut. The punch that finishes fights.
It is dangerous, but it leaves you exposed. Technique is everything here.
Keep your hands high.
Let's work.`,

    'N-s05-outro.txt': `Session 5 complete. You now know all four fundamental punches.
Jab. Cross. Hook. Uppercut.
In Session 6, we stop punching and start moving. Head movement and Defense.
Well done today.
Stay safe, and take care.`,

    'N-s06-intro.txt': `Welcome to Session 6.
Boxing is hit and don't get hit. Today is about the second part.
Slips. Rolls. Blocks.
We will integrate defense with your offense.
Stay sharp.
Let's begin.`,

    'N-s06-outro.txt': `Session 6 is done. You are harder to hit now.
You are beginning to move like a boxer.
Session 7 is about flow. Putting it all together in combinations.
Rest up.
Stay safe, and take care.`,

    'N-s07-intro.txt': `Welcome to Session 7.
Combinations. Rhythm. Flow.
We are moving beyond single shots. We are building chains of movement.
Don't rush. Find the rhythm.
Let's work.`,

    'N-s07-outro.txt': `Session 7 complete. You are finding your flow.
The punches should feel more natural now. Less thinking, more moving.
Session 8 pushes the pace. We will focus on Speed and Endurance.
Prepare yourself.
Stay safe, and take care.`,

    'N-s08-intro.txt': `Welcome to Session 8.
Speed kills. But speed comes from relaxation, not tension.
Today we increase the tempo. High volume. High energy.
Breathe.
Let's begin.`,

    'N-s08-outro.txt': `Session 8 is done. That was a high output session.
Your conditioning is improving.
Session 9 is the opposite. We slow it down but turn it up. Power.
Recover well.
Stay safe, and take care.`,

    'N-s09-intro.txt': `Welcome to Session 9.
Power.
Power is not about muscle. It is about leverage and intent.
Sit down on your punches. Make every shot count.
Let's work.`,

    'N-s09-outro.txt': `Session 9 complete. You felt the difference.
Heavy hands. Grounded movement.
Only one session remains. Session 10. The Championship Rounds.
We put everything together.
Stay safe, and take care.`,

    'N-s10-intro.txt': `Welcome to Session 10.
The Final Session.
Everything you have learned. Stance, Footwork, Offense, Defense, Speed, Power.
Empty the tank today. Leave nothing behind.
Let's finish this.`,

    'N-s10-outro.txt': `Session 10 is done. The programme is complete.
Take a moment. Feel the difference in your body from when you started.
You have interrupt inertia. You have built a foundation.
The work continues. The road is open.
Thank you for training with Sofa2Slugger.
Stay safe, and take care.`
};

for (const [file, content] of Object.entries(scripts)) {
    fs.writeFileSync(path.join(dir, file), content.trim());
    console.log(`Created ${file}`);
}
