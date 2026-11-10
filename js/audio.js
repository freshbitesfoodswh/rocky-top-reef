/**
 * Original "Pearl Fanfare" for mastery celebrations.
 * Do not replace this with Rocky Top or any university fight-song recording.
 * Frequencies are a short original brass-and-sparkle gesture (~2.4s).
 */

let ctx;

function ac() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(context, dest, freq, when, dur, type, peak = 0.18) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(when);
  osc.stop(when + dur + 0.03);
}

export function playReefCheer() {
  const context = ac();
  if (!context) return;
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.9, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 2.55);
  master.connect(context.destination);
  const notes = [
    [523.25, 0.0, 0.18],
    [659.25, 0.16, 0.18],
    [783.99, 0.32, 0.2],
    [1046.5, 0.5, 0.42],
    [1318.51, 1.0, 0.12],
    [1567.98, 1.14, 0.14],
    [1174.66, 1.3, 0.18],
  ];
  for (const [freq, t, dur] of notes) tone(context, master, freq, now + t, dur, "triangle", 0.22);
  for (const freq of [523.25, 659.25, 783.99, 1046.5]) {
    tone(context, master, freq, now + 1.55, 0.85, "sine", 0.12);
  }
}

export function playTap() {
  const context = ac();
  if (!context) return;
  const now = context.currentTime;
  tone(context, context.destination, 540, now, 0.045, "sine", 0.035);
  tone(context, context.destination, 820, now + 0.03, 0.05, "triangle", 0.025);
}

export function playPearl() {
  const context = ac();
  if (!context) return;
  const now = context.currentTime;
  tone(context, context.destination, 880, now, 0.1, "sine", 0.08);
  tone(context, context.destination, 1318.5, now + 0.07, 0.12, "sine", 0.07);
}

export function playCrystal() {
  const context = ac();
  if (!context) return;
  const now = context.currentTime;
  [659.25, 880, 1174.66, 1567.98].forEach((freq, i) => {
    tone(context, context.destination, freq, now + i * 0.08, 0.22, "sine", 0.07);
  });
}
