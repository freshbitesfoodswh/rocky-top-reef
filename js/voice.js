/**
 * All read-aloud is baked mp3 clips in assets/voice-cast/<character>/.
 * There is no browser read-aloud fallback. A missing file shows the caption only
 * and is recorded in missingClipList().
 * SpeechRecognition is constructed only by listenOnce, after the mic toggle is on.
 * Do not call ElevenLabs from the client.
 */

export const MOM_LINES = {
  praise: "I'm so proud of how hard you tried today. That brave effort matters.",
  welcome: "Welcome back. I'm glad we can look at the reef together.",
};

export const MOM_PRAISE_LINE = MOM_LINES.praise;

let momAudio = null;
let momFallbackToken = 0;
let talkToken = 0;

function calmMotion() {
  if (typeof document === "undefined" || typeof window === "undefined") return true;
  if (document.body.classList.contains("calm")) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function beginTalk() {
  const token = ++talkToken;
  if (!calmMotion()) document.body.classList.add("talking");
  return token;
}

function endTalk(token) {
  if (token !== talkToken) return;
  document.body.classList.remove("talking");
}

const missingClipIds = [];

export function missingClipList() {
  return missingClipIds.slice();
}

function noteMissing(id) {
  const key = String(id || "").replace(/\.mp3$/, "");
  if (!key || missingClipIds.includes(key)) return;
  missingClipIds.push(key);
  console.warn("missing clip", key);
}

export function hushMouth() {
  talkToken += 1;
  speechQueue.length = 0;
  if (momAudio) {
    momAudio.pause();
    momAudio = null;
  }
  if (typeof document !== "undefined") document.body.classList.remove("talking");
}

export function playMomLine(id) {
  const text = MOM_LINES[id];
  if (!text) return;
  speak(text, { audioKey: `mom-${id}` });
}

export function playMomPraise() {
  return playMomLine("praise");
}

const SKIP_WORDS = new Set(["like", "the", "a", "an", "in", "of", "and", "to", "it", "is"]);
const NUMBER_WORDS = {
  zero: "0", one: "1", two: "2", three: "3", four: "4",
  five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
};
const SOUND_ALIASES = {
  a: ["a", "ah", "aaa", "ay"],
  e: ["e", "eh", "eee"],
  i: ["i", "ih", "iii", "eye"],
  o: ["o", "oh", "ooo"],
  u: ["u", "uh", "uhh"],
  m: ["m", "em", "mmm", "mm", "muh"],
  s: ["s", "ess", "sss", "ss"],
  t: ["t", "tee", "ttt", "tuh"],
  p: ["p", "pee", "puh"],
  n: ["n", "en", "nnn", "nuh"],
  b: ["b", "bee", "buh"],
  d: ["d", "dee", "duh"],
  c: ["c", "see", "kuh", "cuh", "kay"],
  f: ["f", "ef", "fff", "ff"],
  g: ["g", "gee", "guh"],
  h: ["h", "aitch", "huh"],
  q: ["q", "cue", "kw"],
  v: ["v", "vee", "vvv"],
  w: ["w", "double"],
  j: ["j", "jay"],
  z: ["z", "zee", "zzz"],
  k: ["k", "kay", "kuh"],
  y: ["y", "why"],
  l: ["l", "el", "lll"],
  r: ["r", "ar", "rrr"],
};

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function speechMatchesAnswer(transcripts, item) {
  const answer = (item?.choices || []).find((choice) => String(choice.id) === String(item.answer));
  if (!answer) return false;
  const targets = new Set();
  const add = (value) => {
    const text = normalize(value);
    if (!text) return;
    targets.add(text);
    text.split(" ").forEach((word) => {
      if (word && !SKIP_WORDS.has(word)) targets.add(word);
    });
  };
  add(answer.id);
  add(answer.label);
  add(answer.speak);
  const aliases = SOUND_ALIASES[String(answer.id).toLowerCase()] || [];
  aliases.forEach((alias) => targets.add(alias));
  const list = Array.isArray(transcripts) ? transcripts : [transcripts];
  return list.some((text) => {
    const heard = normalize(text);
    if (!heard) return false;
    const words = heard.split(" ").flatMap((word) => [word, NUMBER_WORDS[word]].filter(Boolean));
    return [...targets].some((target) => target === heard || words.includes(target));
  });
}

export function browserCanListen() {
  return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/** Starts one listen. Caller must already have parent opt-in. */
export function listenOnce({ onText, onSoft }) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) {
    onSoft();
    return () => {};
  }
  const recog = new Ctor();
  recog.lang = "en-US";
  recog.continuous = false;
  recog.interimResults = false;
  recog.maxAlternatives = 5;
  let settled = false;
  const miss = () => {
    if (settled) return;
    settled = true;
    onSoft();
  };
  recog.onresult = (event) => {
    if (settled) return;
    settled = true;
    const result = event.results[event.results.length - 1];
    const texts = [];
    for (let i = 0; i < result.length; i += 1) texts.push(result[i].transcript);
    onText(texts);
  };
  recog.onerror = (event) => {
    if (event.error === "aborted") return;
    miss();
  };
  recog.onnomatch = miss;
  try {
    recog.start();
  } catch {
    miss();
  }
  return () => {
    settled = true;
    try { recog.abort(); } catch { /* already stopped */ }
  };
}

const speechQueue = [];
let speechBusy = false;

function normLine(value) {
  return String(value || "").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}

function drainSpeech() {
  const job = speechQueue.shift();
  if (!job) {
    speechBusy = false;
    return;
  }
  speechBusy = true;
  playPreferred(job, () => drainSpeech());
}

function characterHint(id) {
  const key = String(id || "");
  if (key.startsWith("mom-")) return "mom";
  if (key.startsWith("bubbles-") || key === "mascot-pa") return "bubbles";
  if (key.startsWith("zippy-") || key.startsWith("sight-") || key === "mascot-cvc" || key === "mascot-sight") return "zippy";
  if (key.startsWith("shelly-") || key.startsWith("num-") || key === "mascot-count") return "shelly";
  if (key.startsWith("coco-") || key === "mascot-addsub") return "coco";
  if (
    key.startsWith("sunny-")
    || key.startsWith("letter-line-")
    || key.startsWith("letter-target-")
    || key.startsWith("letter-hum-")
    || key.startsWith("cheer-")
    || key === "nudge"
    || key === "ease"
    || key === "harder"
    || key === "skip"
    || key === "mascot-letters"
  ) return "sunny";
  return "";
}

let catalogPromise = null;

function appRoot() {
  return new URL("../", import.meta.url);
}

export function appUrl(path) {
  return new URL(path, appRoot()).href;
}

function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(appUrl("assets/voice-cast/index.json"))
      .then((response) => {
        if (!response.ok) throw new Error("voice index");
        return response.json();
      })
      .catch(() => ({}));
  }
  return catalogPromise;
}

function pickPath(entry, id, speaker) {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  if (speaker && entry[speaker]) return entry[speaker];
  const hint = characterHint(id);
  if (hint && entry[hint]) return entry[hint];
  return entry.zippy || entry.bubbles || Object.values(entry)[0] || "";
}

/** Resolves a clip id to its character folder. Shared words follow the speaker. */
export function clipUrl(id, speaker = "") {
  const key = String(id || "").replace(/\.mp3$/, "");
  return loadCatalog().then((index) => {
    const path = pickPath(index[key], key, speaker);
    return path ? appUrl(`assets/voice-cast/${path}`) : "";
  });
}

function setsHost(id) {
  const key = String(id || "");
  if (
    key.startsWith("letter-hum-")
    || key.startsWith("word-")
    || key.startsWith("num-")
    || key.startsWith("coco-num-")
    || key.startsWith("cheer-")
  ) return false;
  return Boolean(characterHint(key));
}

function playSequence(ids, done) {
  let host = "";
  for (const id of ids) {
    if (setsHost(id)) {
      host = characterHint(id);
      break;
    }
  }
  let index = 0;
  let mouth = 0;
  const step = () => {
    if (index >= ids.length) {
      endTalk(mouth);
      done();
      return;
    }
    const id = ids[index];
    index += 1;
    playClip(id, host, () => {
      noteMissing(id);
      step();
    }, step, () => {
      if (!mouth) mouth = beginTalk();
    });
  };
  step();
}

export function planItem(item) {
  if (!item) return [];
  const answer = String(item.answer || "");
  if (item.kind === "letter") return ["sunny-which-sound", `letter-hum-${answer}`];
  if (item.kind === "blend") {
    const parts = (item.parts || []).map((part) => `letter-hum-${part}`);
    return ["zippy-blend", ...parts, `word-${answer}`];
  }
  if (String(item.audio_key || "").startsWith("rhyme")) return ["bubbles-rhyme", `word-${item.display}`];
  if (item.kind === "sight") return ["zippy-sight", `sight-${answer}`];
  if (item.kind === "spy-first") return [`word-${item.display}`, "bubbles-first-sound"];
  if (item.kind === "spy-last") return [`word-${item.display}`, "bubbles-last-sound"];
  if (item.kind === "count") return ["shelly-how-many", `num-${answer}`];
  if (item.kind === "compare") return ["shelly-which-nest"];
  if (item.kind === "story") {
    const leave = /away/.test(item.story || item.prompt || "");
    return [leave ? "coco-leave" : "coco-join", `coco-num-${item.dots}`, `coco-num-${item.dotsB}`, `coco-num-${answer}`];
  }
  if (item.audio_key) return [String(item.audio_key).replace(/\.mp3$/, "")];
  return [];
}

const LINE_TO_CLIP = {
  "ooh, that one tricked me too — let’s sneak up on it.": "nudge",
  "ooh, that one tricked me too — let's sneak up on it.": "nudge",
  "let’s float to a cozier current. i’ll hum a hint.": "ease",
  "let's float to a cozier current. i'll hum a hint.": "ease",
  "a deeper current is opening. we can swim it together.": "harder",
  "the path opened a wider lagoon. let’s peek together.": "skip",
  "the path opened a wider lagoon. let's peek together.": "skip",
  "you stretched those sounds!": "cheer-0",
  "your ear caught that one!": "cheer-1",
  "that swam right into place!": "cheer-2",
  "i like how you tried that!": "cheer-3",
  "i'm so proud of how hard you tried today. that brave effort matters.": "mom-praise",
  "welcome back. i'm glad we can look at the reef together.": "mom-welcome",
  "hi, everleigh. i am sunny. want to light the crystal path, or practice a reef game?": "sunny-hi-everleigh",
  "hi, everleigh. the reef is open. light the crystal path, practice a game, or swim an explorer check.": "sunny-reef-open",
  "hi, everleigh. explorer check is a swim, not a test. finish a lagoon and a gem appears. no grades.": "sunny-explorer",
  "these games open after your reef swim. the swim is ready whenever you are.": "sunny-soon",
  "let’s visit letter friends in the lagoon.": "mascot-letters",
  "let's visit letter friends in the lagoon.": "mascot-letters",
  "let’s listen for the first sound, nice and slow.": "mascot-pa",
  "let's listen for the first sound, nice and slow.": "mascot-pa",
  "these little words are swimming by. let’s blend them.": "mascot-cvc",
  "these little words are swimming by. let's blend them.": "mascot-cvc",
  "some words we remember by sight. no rush.": "mascot-sight",
  "count the pearls with me, one shell at a time.": "mascot-count",
  "a tiny fish story. we can use the fish to help.": "mascot-addsub",
};

export function planClips(text, audioKey) {
  if (audioKey) return [String(audioKey).replace(/\.mp3$/, "")];
  const hit = LINE_TO_CLIP[normLine(text).toLowerCase()];
  if (hit) return [hit];
  const letter = normLine(text).toLowerCase();
  if (/^[a-z]$/.test(letter)) return [`letter-hum-${letter}`];
  if (/^\d+$/.test(letter)) return [`num-${letter}`];
  return [];
}

export function speak(text, { enabled = true, audioKey = "", clips = null, requireAll = false } = {}) {
  if (!enabled || !text) return;
  const sequence = (clips && clips.length ? clips : planClips(text, audioKey)).map((id) => String(id).replace(/\.mp3$/, ""));
  if (requireAll) {
    loadCatalog().then((index) => {
      const missing = sequence.filter((id) => !pickPath(index[id], id, "sunny"));
      if (missing.length) {
        missing.forEach((id) => noteMissing(id));
        return;
      }
      speechQueue.push({ text: String(text), sequence });
      if (!speechBusy) drainSpeech();
    });
    return;
  }
  speechQueue.push({ text: String(text), sequence });
  if (!speechBusy) drainSpeech();
}

function playPreferred(job, done) {
  const sequence = job.sequence || [];
  if (!sequence.length) {
    noteMissing(normLine(job.text).slice(0, 80) || "empty-line");
    done();
    return;
  }
  playSequence(sequence, done);
}

function playUrl(src, onFail, onDone, onPlay) {
  let failed = false;
  const fail = () => {
    if (failed) return;
    failed = true;
    onFail();
  };
  try {
    if (momAudio) momAudio.pause();
    const audio = new Audio(src);
    momAudio = audio;
    audio.addEventListener("playing", () => { if (onPlay) onPlay(); }, { once: true });
    audio.addEventListener("ended", () => onDone(), { once: true });
    audio.addEventListener("error", fail, { once: true });
    audio.play().catch(fail);
  } catch {
    fail();
  }
}

function playClip(id, speaker, onFail, onDone, onPlay) {
  clipUrl(id, speaker).then((src) => {
    if (!src) {
      onFail();
      return;
    }
    playUrl(src, onFail, onDone, onPlay);
  }).catch(onFail);
}
