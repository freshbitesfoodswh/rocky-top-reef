import {
  MODULES,
  STICKERS,
  NUDGE,
  REWARDS,
  freshProgress,
  takeNextItem,
  recordAnswer,
  generatePack,
  noteItem,
  awardPracticeCorrect,
  finishRun,
  suggestBranch,
  EXPLORER_AREAS,
  baselineProgress,
  awardAreaGem,
  noteAreaCheck,
  assessmentReport,
  parentInsights,
  assessFinishCopy,
  practiceFinishCopy,
  restCopy,
  cheerLine,
  emptyState,
  reefTitle,
} from "./engine.js";
import { load, save, adoptState, encodeBackup, decodeBackup } from "./store.js";
import { speak, listenOnce, speechMatchesAnswer, browserCanListen, playMomLine, hushMouth, MOM_LINES, planItem, planClips } from "./voice.js";
import { playReefCheer, playPearl, playCrystal, playTap } from "./audio.js";
import { sha256Hex } from "./gate.js";

const PUBLIC_TITLE = "Everleigh's Rocky Top Reef";

const app = document.getElementById("app");
const parentsBtn = document.getElementById("parents-jump");
let db = load();
let play = null;
let stopListening = null;
let returnScreen = "splash";
function childHome() {
  return baselineProgress(db).lessonsOpen ? "splash" : "explorer";
}

const ui = {
  screen: childHome(),
  pin: "",
  pinMsg: "",
  codePhase: "new",
  draft: "",
  unlockFor: "",
  coveOpen: false,
  copied: false,
  simPack: null,
  simN: 0,
  confirmReset: false,
  backupCode: "",
  restoreNote: "",
};

applySettings();
parentsBtn.addEventListener("click", () => {
  if (["consent", "parents", "unlock", "change-code"].includes(ui.screen)) return;
  haltListening();
  returnScreen = ui.screen;
  ui.pin = "";
  ui.pinMsg = "";
  ui.draft = "";
  if (!db.settings.parentCodeHash) {
    ui.codePhase = "new";
    ui.screen = "consent";
  } else if (ui.coveOpen) {
    ui.screen = "parents";
  } else {
    ui.codePhase = "check";
    ui.screen = "unlock";
  }
  render();
});
app.addEventListener("click", onClick);
document.addEventListener("keydown", onKey);
window.generatePack = generatePack;
window.ReefDemo = { generatePack, parentInsights: () => parentInsights(db) };

function applySettings() {
  document.body.dataset.theme = db.settings.theme || "orange";
  document.body.classList.toggle("contrast", Boolean(db.settings.contrast));
  document.body.classList.toggle("calm", Boolean(db.settings.reducedMotion));
}

let audioUnlocked = false;
let spokenKey = "";
let captionText = "";

function currentPrompt() {
  const screen = ui.screen;
  if (screen === "soon") {
    return {
      key: "soon",
      text: "These games open after your reef swim. The swim is ready whenever you are.",
      audioKey: "",
    };
  }
  if (screen === "splash") {
    return {
      key: "splash",
      text: "Hi, Everleigh. I am Sunny. Want to light the Crystal Path, or practice a reef game?",
      audioKey: "",
    };
  }
  if (screen === "harbor") {
    return {
      key: "harbor",
      text: "Hi, Everleigh. The reef is open. Light the Crystal Path, practice a game, or swim an Explorer Check.",
      audioKey: "",
    };
  }
  if (screen === "play" && play) {
    if (play.listening) return { key: `listen-${play.step}-${play.bubble}`, text: play.bubble, audioKey: "" };
    if (play.phase === "bridge") {
      const text = `${MODULES[play.bridgeTo]?.mascotLine || ""} ${play.bubble || ""}`.trim();
      return { key: `bridge-${play.bridgeTo}-${text}`, text, audioKey: "" };
    }
    if (play.phase === "ask") {
      const text = play.cue || play.item.speak || play.item.prompt;
      return {
        key: `ask-${play.moduleId}-${play.step}-${text}`,
        text,
        audioKey: play.cue ? (play.cueKey || "") : (play.item.audio_key || ""),
      };
    }
    const text = play.bubble || play.item.speak || "";
    return { key: `${play.phase}-${play.moduleId}-${play.step}-${text}`, text, audioKey: play.cueKey || "" };
  }
  if (screen === "done" && ui.done) {
    const text = ui.done.mode === "practice"
      ? practiceFinishCopy(ui.done.pearlsFromClicks)
      : assessFinishCopy(ui.done.title);
    return { key: `done-${text}`, text, audioKey: "" };
  }
  if (screen === "rest" && ui.done) {
    const text = restCopy(ui.done.mode, ui.done.pearlsFromClicks);
    return { key: `rest-${text}`, text, audioKey: "" };
  }
  if (screen === "explorer") {
    return { key: "explorer", text: "Hi, Everleigh. Explorer Check is a swim, not a test. Finish a lagoon and a gem appears. No grades.", audioKey: "" };
  }
  if (screen === "room") {
    return { key: "room", text: "Decor colors are Tennessee Orange, white, and soft gray. Stickers show up when a swim is finished.", audioKey: "" };
  }
  if (screen === "stickers") {
    return { key: "stickers", text: "Stickers appear when a swim is finished. Empty shells are still swimming.", audioKey: "" };
  }
  if (screen === "parents") {
    return { key: "parents", text: MOM_LINES.welcome, audioKey: "mom-welcome" };
  }
  if (screen === "consent") {
    const text = ui.codePhase === "confirm"
      ? "Enter that code again to confirm."
      : "A grown-up step. Create a parent code for this device.";
    return { key: `consent-${ui.codePhase}`, text, audioKey: "" };
  }
  if (screen === "unlock") return { key: "unlock", text: "Enter the parent code for this device.", audioKey: "" };
  if (screen === "change-code") return { key: `code-${ui.codePhase}`, text: "Change the parent code on this device.", audioKey: "" };
  return { key: screen, text: "", audioKey: "" };
}

function showCaption(text) {
  captionText = text || "";
  const cap = document.getElementById("caption");
  if (!cap) return;
  cap.textContent = captionText;
  cap.hidden = db.settings.captions === false || !captionText;
  document.body.classList.toggle("captions", !cap.hidden);
}

function syncChrome() {
  const voiceBtn = document.getElementById("voice-toggle");
  const micBtn = document.getElementById("mic-toggle");
  const ccBtn = document.getElementById("cc-toggle");
  const voiceOn = db.settings.voice !== false;
  const micOn = db.settings.spokenAnswers !== false;
  const ccOn = db.settings.captions !== false;
  if (micBtn) {
    micBtn.classList.toggle("is-off", !micOn);
    micBtn.setAttribute("aria-pressed", micOn ? "true" : "false");
    micBtn.setAttribute("aria-label", micOn
      ? "Microphone is on. Tap to turn it off. Answers can still be tapped."
      : "Microphone is off. Tap to turn it on. Answers can still be tapped.");
  }
  if (voiceBtn) {
    voiceBtn.classList.toggle("is-off", !voiceOn);
    voiceBtn.setAttribute("aria-pressed", voiceOn ? "true" : "false");
    voiceBtn.setAttribute("aria-label", voiceOn ? "Sunny's voice is on. Tap to mute." : "Sunny's voice is off. Tap to turn it on.");
  }
  if (ccBtn) {
    ccBtn.classList.toggle("is-off", !ccOn);
    ccBtn.setAttribute("aria-pressed", ccOn ? "true" : "false");
    ccBtn.setAttribute("aria-label", ccOn ? "Captions are on. Tap to hide the words." : "Captions are off. Tap to show the words.");
  }
  showCaption(captionText || currentPrompt().text);
}

function speechClips(prompt) {
  if (ui.screen === "play" && play && play.phase === "ask" && !play.cue) return planItem(play.item);
  return planClips(prompt.text, prompt.audioKey);
}

function offerSpeech() {
  const prompt = currentPrompt();
  showCaption(prompt.text);
  if (!prompt.text || !audioUnlocked || db.settings.voice === false) return;
  if (prompt.key === spokenKey) return;
  spokenKey = prompt.key;
  speak(prompt.text, { enabled: true, audioKey: prompt.audioKey || "", clips: speechClips(prompt) });
}

function replayLine() {
  const prompt = currentPrompt();
  if (!prompt.text) return;
  audioUnlocked = true;
  showCaption(prompt.text);
  if (db.settings.voice === false) return;
  spokenKey = prompt.key;
  speak(prompt.text, { enabled: true, audioKey: prompt.audioKey || "", clips: speechClips(prompt) });
}

function armAudio(event) {
  if (event?.target?.closest && event.target.closest("#voice-toggle")) {
    audioUnlocked = true;
    return;
  }
  if (audioUnlocked) return;
  audioUnlocked = true;
  setTimeout(() => offerSpeech(), 0);
}

function say(text, audioKey) {
  if (!text) return;
  showCaption(text);
  if (!audioUnlocked || db.settings.voice === false) return;
  spokenKey = `live|${text}`;
  speak(text, { enabled: true, audioKey, clips: planClips(text, audioKey) });
}

function onClick(event) {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  if (el.tagName === "BUTTON" && action !== "pin") {
    el.classList.add("pressed");
    window.setTimeout(() => el.classList.remove("pressed"), 180);
    if (db.settings.sfx) playTap();
  }
  if (action === "start") {
    ui.screen = baselineProgress(db).lessonsOpen ? "harbor" : "explorer";
    render();
    return;
  }
  if (action === "ask-unlock") {
    ui.unlockFor = "lessons";
    ui.pin = "";
    ui.pinMsg = "";
    ui.draft = "";
    if (!db.settings.parentCodeHash) {
      ui.codePhase = "new";
      ui.screen = "consent";
    } else {
      ui.codePhase = "check";
      ui.screen = "unlock";
    }
    render();
    return;
  }
  if (action === "lagoon-wait") {
    showCaption("This lagoon comes after the glowing one.");
    return;
  }
  if (action === "soon") {
    ui.screen = "soon";
    render();
    return;
  }
  if (action === "resume-swim") {
    const remaining = baselineProgress(db).remaining;
    if (!remaining.length) {
      ui.screen = "harbor";
      render();
      return;
    }
    const [first, ...rest] = remaining;
    begin("assess", first, "explorer", rest);
    return;
  }
  if (action === "replay") {
    replayLine();
    return;
  }
  if (action === "go") {
    haltListening();
    ui.screen = el.dataset.screen || "harbor";
    render();
    return;
  }
  if (action === "begin") {
    const mode = el.dataset.mode;
    const kind = el.dataset.kind;
    const open = baselineProgress(db).lessonsOpen;
    if (!open && (mode === "practice" || kind === "path")) {
      ui.screen = "soon";
      render();
      return;
    }
    begin(mode, el.dataset.module, kind);
  }
  if (action === "pick") pick(el.dataset.id);
  if (action === "hear") say(el.dataset.text || "", el.dataset.audio || "");
  if (action === "hear-item") play && say(play.item.speak, play.item.audio_key);
  if (action === "blend") play && say((play.item.parts || []).join(", "));
  if (action === "blend-part") say(el.dataset.text || "");
  if (action === "hint") showHint();
  if (action === "advance") advance();
  if (action === "bridge") beginBridge();
  if (action === "rest") rest();
  if (action === "spoken") {
    db.settings.spokenAnswers = !db.settings.spokenAnswers;
    if (!db.settings.spokenAnswers) haltListening();
    save(db);
    render();
    return;
  }
  if (action === "say") {
    startListening();
    return;
  }
  if (action === "quiet") {
    const on = !(db.settings.voice || db.settings.sfx);
    db.settings.voice = on;
    db.settings.sfx = on;
    save(db);
    render();
  }
  if (action === "cheer") db.settings.sfx && playReefCheer();
  if (action === "crystal") db.settings.sfx && playCrystal();
  if (action === "pin") pinKey(el.dataset.key);
  if (action === "accept-gate") {
    submitCode();
    return;
  }
  if (action === "change-code") {
    ui.pin = "";
    ui.pinMsg = "";
    ui.draft = "";
    ui.codePhase = "old";
    ui.screen = "change-code";
    render();
    return;
  }
  if (action === "copy-guide") {
    const text = document.getElementById("parent-guide")?.value || "";
    navigator.clipboard.writeText(text).then(() => {
      ui.copied = true;
      render();
    }).catch(() => {});
    return;
  }
  if (action === "copy") copyTeacher();
  if (action === "sim") simulatePack();
  if (action === "theme") setTheme(el.dataset.theme);
  if (action === "toggle") toggleSetting(el.dataset.key);
  if (action === "export") exportJson();
  if (action === "export-checks") {
    const blob = new Blob([assessmentReport(db).text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rocky-top-reef-checks.txt";
    a.click();
    URL.revokeObjectURL(a.href);
    return;
  }
  if (action === "print-checks") {
    window.print();
    return;
  }
  if (action === "mom") {
    const id = el.dataset.line || "praise";
    showCaption(MOM_LINES[id] || "");
    if (db.settings.voice !== false) playMomLine(id);
    return;
  }
  if (action === "make-code") {
    ui.backupCode = encodeBackup(db);
    ui.restoreNote = "Each browser is separate until this code is restored on the other one.";
    render();
    return;
  }
  if (action === "copy-code") {
    const code = document.getElementById("backup-code")?.value || ui.backupCode;
    navigator.clipboard.writeText(code).then(() => {
      ui.restoreNote = "Backup code copied.";
      render();
    }).catch(() => {
      ui.restoreNote = "Select the code and copy it.";
      render();
    });
    return;
  }
  if (action === "restore-code") {
    restoreText(document.getElementById("restore-text")?.value || "");
    return;
  }
  if (action === "reset-ask") {
    ui.confirmReset = true;
    render();
  }
  if (action === "reset-yes") {
    db = emptyState();
    save(db);
    applySettings();
    haltListening();
    ui.confirmReset = false;
    ui.simPack = null;
    ui.pin = "";
    ui.backupCode = "";
    ui.screen = "consent";
    render();
  }
  if (action === "lock") {
    ui.screen = returnScreen || "harbor";
    ui.pin = "";
    render();
  }
}

function onKey(event) {
  const coding = ui.screen === "consent" || ui.screen === "unlock" || ui.screen === "change-code";
  if (coding && /^[0-9]$/.test(event.key)) pinKey(event.key);
  if (coding && event.key === "Backspace") pinKey("del");
  if (coding && event.key === "Enter") submitCode();
  if (ui.screen === "play" && play && /^[1-3]$/.test(event.key)) {
    const choice = play.item.choices[Number(event.key) - 1];
    if (choice) pick(choice.id);
  }
}

function begin(mode, moduleId, kind, areaQueue) {
  haltListening();
  const saved = db.placement[moduleId]?.level;
  let progress = freshProgress(moduleId, saved);
  const taken = takeNextItem(progress);
  progress = taken.progress;
  const steps = kind === "path" ? MODULES.letters.assessSteps : mode === "practice" ? 6 : MODULES[moduleId].assessSteps;
  play = {
    mode,
    kind,
    moduleId,
    progress,
    item: taken.item,
    phase: "ask",
    attempts: 0,
    step: 1,
    steps,
    pearlsFromClicks: 0,
    starsThisRun: 0,
    runStreak: 0,
    modulesInRun: [moduleId],
    branched: false,
    started: Date.now(),
    dimmed: null,
    reveal: null,
    bubble: taken.item.showHint ? taken.item.hint : taken.item.lead,
    whisper: "",
    queue: [],
    bridgeTo: null,
    areaQueue: kind === "explorer" ? (areaQueue || EXPLORER_AREAS.filter((id) => id !== moduleId)) : [],
    cue: "",
    cueKey: "",
  };
  ui.screen = "play";
  render();
}

function haltListening() {
  if (stopListening) stopListening();
  stopListening = null;
  if (play) play.listening = false;
}

function startListening() {
  if (!db.settings.spokenAnswers || !play || play.phase !== "ask") return;
  haltListening();
  hushMouth();
  play.listening = true;
  play.bubble = "Sunny is listening. You can tap a shell anytime.";
  render();
  stopListening = listenOnce({
    onText: (texts) => {
      stopListening = null;
      if (!play || play.phase !== "ask") return;
      play.listening = false;
      if (speechMatchesAnswer(texts, play.item)) {
        pick(play.item.answer);
        return;
      }
      play.bubble = "I didn’t quite catch that. Say it again, or tap a shell.";
      play.cue = play.bubble;
      play.cueKey = "";
      render();
    },
    onSoft: () => {
      stopListening = null;
      if (!play || play.phase !== "ask") return;
      play.listening = false;
      play.bubble = "I didn’t hear a word. You can try again, or tap a shell.";
      play.cue = play.bubble;
      play.cueKey = "";
      render();
    },
  });
}

function pick(id) {
  haltListening();
  if (!play || play.phase !== "ask") return;
  const item = play.item;
  if (id === item.answer) {
    const rec = recordAnswer(play.progress, item, true, play.mode === "practice" ? "practice" : "assess");
    play.progress = rec.progress;
    noteItem(db, play.progress, true, rec.event, play.mode);
    play.phase = "next";
    play.reveal = id;
    play.runStreak += 1;
    const cheer = cheerLine(play.step + play.runStreak);
    play.bubble = cheer;
    play.cue = "";
    play.cueKey = "";
    if (play.mode === "practice") {
      const award = awardPracticeCorrect(db, play.runStreak);
      play.pearlsFromClicks += award.pearls;
      if (award.star) play.starsThisRun += 1;
      play.bubble += ` Plus ${award.pearls} pearls.`;
      if (award.star) play.bubble += " A star bloomed.";
      if (db.settings.sfx) playPearl();
    }
    if (["harder", "bump", "skip"].includes(rec.event)) play.whisper = rec.line;
    maybePack(rec.event);
    save(db);
  } else if (play.attempts === 0) {
    play.attempts = 1;
    play.dimmed = id;
    play.bubble = `${NUDGE} ${item.hint}`;
    play.cue = NUDGE;
    play.cueKey = "nudge";
  } else {
    const rec = recordAnswer(play.progress, item, false, play.mode === "practice" ? "practice" : "assess");
    play.progress = rec.progress;
    noteItem(db, play.progress, false, rec.event, play.mode);
    play.phase = "teach";
    play.reveal = item.answer;
    play.runStreak = 0;
    play.bubble = rec.event === "ease" ? `${rec.line} ${item.worked}` : item.worked;
    play.cue = "";
    play.cueKey = rec.event === "ease" ? "ease" : "";
    if (["harder", "bump", "skip"].includes(rec.event)) play.whisper = rec.line;
    maybePack(rec.event);
    save(db);
  }
  render();
}

function showHint() {
  if (!play) return;
  play.bubble = play.item.hint;
  play.cue = play.item.hint;
  play.cueKey = "";
  render();
}

function maybePack(event) {
  if (!play || !["harder", "bump", "skip"].includes(event)) return;
  const mod = MODULES[play.moduleId];
  const n = (db.packIndex[mod.skillId] || 0) + 1;
  const pack = generatePack(mod.skillId, {
    packNumber: n,
    difficulty: play.progress.level,
    tier: play.progress.tier,
    count: Math.max(1, play.steps - play.step),
    avoidIds: [play.item.key],
  });
  db.packIndex[mod.skillId] = n;
  db.lastPack = pack;
  play.queue = pack.items.slice();
}

function advance() {
  haltListening();
  if (!play) return;
  if (play.step >= play.steps) {
    if (play.kind === "explorer") {
      const wasFinished = baselineProgress(db).finished;
      awardAreaGem(db, play.moduleId);
      if (!wasFinished && baselineProgress(db).finished) play.reefOpened = true;
      save(db);
      if (play.areaQueue && play.areaQueue.length) {
        play.phase = "bridge";
        play.bridgeTo = play.areaQueue[0];
        play.bubble = "This lagoon is lit. A gem for finishing. Rest, or swim to the next one.";
        play.cue = "";
        render();
        return;
      }
      finish(true, true);
      return;
    }
    if (play.kind === "path" && !play.branched) {
      const next = suggestBranch("letters", play.progress);
      if (next) {
        play.branched = true;
        play.phase = "bridge";
        play.bridgeTo = next;
        play.cue = "";
        render();
        return;
      }
    }
    finish(true);
    return;
  }
  play.step += 1;
  serveNext();
}

function serveNext() {
  let item;
  if (play.queue.length) item = play.queue.shift();
  else {
    const taken = takeNextItem(play.progress);
    play.progress = taken.progress;
    item = taken.item;
  }
  play.item = item;
  play.phase = "ask";
  play.attempts = 0;
  play.dimmed = null;
  play.reveal = null;
  const whisper = play.whisper;
  play.whisper = "";
  play.bubble = whisper || (item.showHint ? item.hint : item.lead);
  play.cue = whisper ? `${whisper} ${item.speak}` : "";
  play.cueKey = "";
  render();
}

function beginBridge() {
  const next = play.bridgeTo;
  let progress = freshProgress(next, db.placement[next]?.level);
  const taken = takeNextItem(progress);
  play.moduleId = next;
  play.progress = taken.progress;
  play.item = taken.item;
  play.step = 1;
  play.steps = MODULES[next].assessSteps;
  play.modulesInRun.push(next);
  play.phase = "ask";
  play.attempts = 0;
  play.queue = [];
  if (play.kind === "explorer" && play.areaQueue && play.areaQueue[0] === next) play.areaQueue.shift();
  play.bubble = taken.item.lead;
  play.cue = `${MODULES[next].mascotLine} ${taken.item.speak}`;
  play.cueKey = "";
  render();
}

function rest() {
  haltListening();
  finish(false);
}

function finish(completed, skipRewards = false) {
  const ms = Date.now() - play.started;
  const wasFinished = baselineProgress(db).finished;
  if (completed && !skipRewards) play.modulesInRun.forEach((id) => noteAreaCheck(db, id));
  const reefOpened = Boolean(play.reefOpened || (completed && !wasFinished && baselineProgress(db).finished));
  const reward = finishRun(db, {
    mode: play.mode,
    moduleIds: [...play.modulesInRun],
    ms,
    completed,
    skipRewards,
  });
  save(db);
  ui.done = {
    mode: play.mode,
    kind: play.kind,
    title: play.kind === "path" ? "the Crystal Path" : MODULES[play.moduleId].childTitle,
    reward,
    pearlsFromClicks: play.pearlsFromClicks,
    starsThisRun: play.starsThisRun,
    completed,
    reefOpened,
  };
  ui.screen = completed ? "done" : "rest";
  render();
  const bigWin = completed && (play.mode === "practice" && play.pearlsFromClicks > 0 || reefOpened);
  if (completed && db.settings.sfx && bigWin) playReefCheer();
  else if (completed && db.settings.sfx && play.mode === "assess") playCrystal();
}

function pinKey(key) {
  if (key === "del") ui.pin = ui.pin.slice(0, -1);
  else if (key !== "ok" && ui.pin.length < 4) ui.pin += key;
  ui.pinMsg = "";
  if (key === "ok") {
    submitCode();
    return;
  }
  render();
}

function clearDraft() {
  ui.pin = "";
  ui.draft = "";
}

async function submitCode() {
  const typed = ui.pin;
  ui.pin = "";
  if (!/^\d{4}$/.test(typed)) {
    ui.pinMsg = "Enter four digits, then continue.";
    render();
    return;
  }
  let hash = "";
  try {
    hash = await sha256Hex(typed);
  } catch {
    clearDraft();
    ui.pinMsg = "This browser could not save the code. Try again in a moment.";
    render();
    return;
  }
  if (!db.settings.parentCodeHash || ui.screen === "consent") {
    if (ui.codePhase !== "confirm") {
      ui.draft = hash;
      ui.codePhase = "confirm";
      ui.pinMsg = "";
      render();
      return;
    }
    if (hash !== ui.draft) {
      clearDraft();
      ui.codePhase = "new";
      ui.pinMsg = "Those did not match. Choose the code again.";
      render();
      return;
    }
    db.settings.parentCodeHash = hash;
    db.settings.gateAccepted = true;
    clearDraft();
    save(db);
    ui.pinMsg = "";
    ui.coveOpen = true;
    if (ui.unlockFor === "lessons") {
      db.settings.lessonsUnlocked = true;
      ui.unlockFor = "";
      save(db);
      ui.screen = "harbor";
    } else {
      ui.screen = "parents";
    }
    render();
    return;
  }
  if (ui.screen === "unlock") {
    if (hash !== db.settings.parentCodeHash) {
      ui.pinMsg = "That code did not open. Try again.";
      render();
      return;
    }
    ui.coveOpen = true;
    ui.pinMsg = "";
    if (ui.unlockFor === "lessons") {
      db.settings.lessonsUnlocked = true;
      ui.unlockFor = "";
      save(db);
      ui.screen = "harbor";
    } else {
      ui.screen = "parents";
    }
    render();
    return;
  }
  if (ui.screen === "change-code") {
    if (ui.codePhase === "old") {
      if (hash !== db.settings.parentCodeHash) {
        ui.pinMsg = "That code did not open. Try again.";
        render();
        return;
      }
      ui.codePhase = "new";
      ui.pinMsg = "";
      render();
      return;
    }
    if (ui.codePhase === "new") {
      ui.draft = hash;
      ui.codePhase = "confirm";
      ui.pinMsg = "";
      render();
      return;
    }
    if (hash !== ui.draft) {
      clearDraft();
      ui.codePhase = "new";
      ui.pinMsg = "Those did not match. Choose the new code again.";
      render();
      return;
    }
    db.settings.parentCodeHash = hash;
    clearDraft();
    save(db);
    ui.pinMsg = "Parent code updated on this device.";
    ui.screen = "parents";
    render();
  }
}

function displayTitle() {
  return reefTitle(db.settings);
}

function parentGuide() {
  return [
    "Everleigh's Rocky Top Reef — grown-up page",
    "",
    "First open on a device",
    "There is no in-app microphone screen. The browser asks for the microphone the first time she uses it. Tap answers always work. The mic button next to Parents turns spoken answers off or on. Sunny still reads aloud. The speaker and CC buttons turn that voice and the word bubble on or off.",
    "",
    "Parent code",
    "The code is created the first time Parents Corner or an early lesson unlock is opened. This browser stores only a hash of it, not the digits, and never sends that hash online. Later, those same doors ask for the code and check it against the hash on this device.",
    "",
    "What the child sees",
    "The title is Everleigh's Rocky Top Reef. The reef swim comes first. Practice games open after that swim, or when a parent unlocks them with the parent code. Check-ins celebrate finishing. Sunny reads each screen after the first tap.",
    "",
    "Move my progress",
    "Each browser is separate until you restore a backup. Make a backup code or download the JSON file here, then paste or open it on the other device. There is no account.",
    "",
    "Delete all data",
    "Clear reef memory on this device erases progress and the unlock flag here only.",
    "",
    "Later",
    "A Google login for the grown-up only (progress only, and delete-all) can be added after Firebase is set up. It is not on.",
  ].join("\n");
}

function simulatePack() {
  ui.simN += 1;
  const difficulty = Math.min(3, ui.simN);
  const avoid = (ui.simPack?.items || []).map((item) => item.key);
  ui.simPack = generatePack("ELA-K-PH-02", {
    packNumber: ui.simN,
    difficulty,
    count: 4,
    avoidIds: avoid,
  });
  db.lastPack = ui.simPack;
  db.packIndex["ELA-K-PH-02"] = ui.simN;
  save(db);
  render();
}

function setTheme(theme) {
  db.settings.theme = theme;
  applySettings();
  save(db);
  render();
}

function toggleSetting(key) {
  db.settings[key] = !db.settings[key];
  if (key === "voice" && !db.settings[key]) hushMouth();
  applySettings();
  save(db);
  render();
  if (key === "voice" && db.settings.voice && audioUnlocked) {
    spokenKey = "";
    offerSpeech();
  }
}

function exportJson() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "rocky-top-reef-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function restoreText(text) {
  try {
    db = adoptState(decodeBackup(text));
    save(db);
    applySettings();
    haltListening();
    ui.restoreNote = "Restored on this browser.";
    ui.backupCode = "";
  } catch {
    ui.restoreNote = "That backup did not open. Check the code or the JSON file.";
  }
  render();
}

async function copyTeacher() {
  const text = parentInsights(db).teacherText;
  try {
    await navigator.clipboard.writeText(text);
    ui.copied = true;
  } catch {
    ui.copied = false;
    const area = document.getElementById("teacher-card");
    area?.focus();
    area?.select();
  }
  render();
}

function render() {
  const screen = ui.screen;
  document.body.dataset.screen = screen;
  document.title = displayTitle();
  app.innerHTML = screens[screen] ? screens[screen]() : screens.splash();
  app.classList.remove("screen-in");
  void app.offsetWidth;
  app.classList.add("screen-in");
  syncChrome();
  offerSpeech();
  document.getElementById("restore-file")?.addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      restoreText(await file.text());
    } catch {
      ui.restoreNote = "That file did not open.";
      render();
    }
  });
}

function ico(name) {
  const paths = {
    path: "M24 6l8 14-8 22L16 20z",
    shell: "M24 40c10 0 16-8 16-16S30 6 24 10 8 16 8 24s6 16 16 16z M24 40V14",
    book: "M10 12h12c4 0 6 2 6 6v18H16c-4 0-6-2-6-6z M26 12h12v24H26c-4 0-6-2-6-6",
    home: "M8 22 L24 8 L40 22 V40 H30 V28 H18 V40 H8z",
    star: "M24 6l4 12h12l-10 8 4 12-10-7-10 7 4-12-10-8h12z",
    play: "M16 10l20 14-20 14z",
  };
  return `<span class="isle-ico" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="${paths[name] || paths.star}"/></svg></span>`;
}

function stageScene(kind) {
  return `<img class="stage-plate" src="themes/ut-unicorn/11-home.jpg" alt="">
    <div class="stage-veil" aria-hidden="true"></div>
    <div class="rays" aria-hidden="true"></div>
    <div class="motes" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div>`;
}

function isle(opts) {
  const data = [
    `data-action="${opts.action}"`,
    opts.mode ? `data-mode="${opts.mode}"` : "",
    opts.module ? `data-module="${opts.module}"` : "",
    opts.kind ? `data-kind="${opts.kind}"` : "",
    opts.screen ? `data-screen="${opts.screen}"` : "",
  ].filter(Boolean).join(" ");
  const omoji = { path: "shell", shell: "shell", star: "sight", play: "blend", home: "home", book: "book" }[opts.icon] || "shell";
  return `<button type="button" class="isle ${opts.soft ? "soft" : ""}" style="--x:${opts.x};--y:${opts.y}" ${data}>
    <img class="omoji" src="assets/icons/openmoji/${omoji}.svg" alt="">
    <span class="isle-name">${esc(opts.title)}</span>
  </button>`;
}

function banner(extra = "") {
  return `<h1 class="reef-banner ${extra}"><span class="reef-banner-board"><span class="reef-banner-text">${esc(displayTitle())}</span><span class="reef-banner-pearls" aria-hidden="true"></span></span></h1>`;
}

function reefLife() {
  const bubbles = Array.from({ length: 8 }, (_, i) => `<i style="--i:${i}"></i>`).join("");
  return `<div class="reef-fx" aria-hidden="true">
    <div class="rays"></div>
    <div class="caustics"></div>
    <div class="kelp kelp-left"></div>
    <div class="kelp kelp-right"></div>
    <div class="kelp kelp-mid"></div>
    <div class="bubbles">${bubbles}</div>
  </div>`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function mascot() {
  return `<button type="button" class="mascot-hit sunny-flip" data-action="replay" aria-label="Sunny. Tap to hear the line again."><span class="sunny-lids" aria-hidden="true"><i></i><i></i></span></button>`;
}

const HOSTS = {
  letters: "sunny",
  pa: "bubbles",
  rhyme: "bubbles",
  first: "bubbles",
  blend: "bubbles",
  segment: "bubbles",
  cvc: "zippy",
  sight: "zippy",
  count: "shelly",
  compare: "shelly",
  add10: "coco",
  add20: "coco",
  addsub: "coco",
};

const HOST_ART = {
  sunny: { name: "Sunny", file: "" },
  bubbles: { name: "Bubbles", file: "assets/characters/bubbles-octopus.jpg" },
  zippy: { name: "Zippy", file: "assets/characters/zippy-seahorse.jpg" },
  shelly: { name: "Shelly", file: "assets/characters/shelly-turtle.jpg" },
  coco: { name: "Coco", file: "assets/characters/coco-crab.jpg" },
};

function hostPortrait(moduleId) {
  const id = HOSTS[moduleId] || "sunny";
  const host = HOST_ART[id];
  if (id === "sunny") {
    return `<button type="button" class="quest-host is-sunny sunny-flip" data-action="replay" aria-label="Sunny. Tap to hear the line again."></button>`;
  }
  return `<button type="button" class="quest-host" data-action="replay" aria-label="${host.name}. Tap to hear the line again."><img src="${host.file}" alt="${host.name}"></button>`;
}

function fishSvg() {
  return `<svg viewBox="0 0 520 340">
    <path d="M118 150c-62-28-92 18-78 58-28 18-24 62 18 70 22-36 40-52 60-70-8-18-6-40 0-58z" fill="#ff8200"/>
    <path d="M112 168c-36-8-48 22-28 36 16-10 22-18 28-36z" fill="#fff6ee"/>
    <path d="M150 168c40-78 210-92 300-20 18 14 28 48 10 78-36 58-160 92-250 70-70-16-92-62-60-128z" fill="#ff8200"/>
    <path d="M188 186c48-36 150-40 214-8 16 8 22 28 8 44-28 36-120 62-190 48-58-12-62-48-32-84z" fill="#fff8f2"/>
    <path d="M210 132c28-52 78-62 96-28-34 6-62 16-96 28z" fill="#ffb15a"/>
    <path d="M248 214c-10 46 24 62 48 42 2-20-16-36-48-42z" fill="#ff9a33"/>
    <path d="M300 118c18-36 48-58 62-78" stroke="#fff3c4" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M332 78c16 6 22 22 8 26" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="392" cy="156" rx="34" ry="38" fill="#fff"/>
    <ellipse cx="402" cy="160" rx="16" ry="18" fill="#3a291f"/>
    <circle cx="408" cy="152" r="6" fill="#fff"/>
    <path d="M360 196c22 28 62 24 86-6" fill="#ff8f86" stroke="#e15a4c" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="348" cy="188" rx="14" ry="8" fill="#ffb199" opacity=".85"/>
  </svg>`;
}

function castleSvg() {
  return `<svg class="reef-castle" viewBox="0 0 300 250" aria-hidden="true">
    <rect x="70" y="110" width="150" height="120" rx="6" fill="#e7e2f2"/>
    <rect x="118" y="78" width="54" height="70" fill="#f4f1fa"/>
    <polygon points="70,112 145,28 220,112" fill="#ef6d9a"/>
    <polygon points="118,80 145,28 172,80" fill="#ff8fb5"/>
    <rect x="36" y="140" width="46" height="90" fill="#ddd6ea"/>
    <polygon points="36,142 59,96 82,142" fill="#e85c96"/>
    <rect x="214" y="128" width="50" height="102" fill="#d9d2e8"/>
    <polygon points="214,130 239,86 264,130" fill="#f07aaa"/>
    <rect x="128" y="168" width="34" height="62" rx="16" fill="#ffb703"/>
    <rect x="92" y="150" width="16" height="22" rx="3" fill="#ffe08a"/>
    <rect x="176" y="146" width="16" height="22" rx="3" fill="#ffe08a"/>
    <rect x="132" y="96" width="12" height="16" rx="2" fill="#ffe08a"/>
    <rect x="48" y="162" width="12" height="16" rx="2" fill="#ffe08a"/>
    <rect x="230" y="156" width="12" height="16" rx="2" fill="#ffe08a"/>
  </svg>`;
}

function stones() {
  const items = Array.from({ length: play.steps }, (_, i) => {
    const cls = i < play.step - 1 ? "done" : i === play.step - 1 ? "now" : "";
    return `<li class="${cls}"></li>`;
  }).join("");
  return `<ol class="stones" aria-label="Step ${play.step} of ${play.steps}">${items}</ol>
    <p class="fine" style="text-align:center;margin:0">Step ${play.step} of ${play.steps}</p>`;
}

function itemBody(item) {
  if (item.kind === "letter" || item.kind === "sight") {
    return `<button class="glyph" type="button" data-action="hear-item">${esc(item.display)}</button>`;
  }
  if (item.kind === "blend") {
    const chips = (item.parts || []).map((part) => `<button type="button" class="chip" data-action="blend-part" data-text="${esc(part)}">${esc(part)}</button>`).join("");
    return `<div class="chips">${chips}</div><button type="button" class="btn secondary" data-action="blend">Blend with Sunny</button>`;
  }
  if (item.kind === "spy-first" || item.kind === "spy-last") {
    return `<div class="glyph" aria-hidden="true">${esc(item.emoji || "🐚")}</div>`;
  }
  if (item.kind === "spy-picture") {
    const chips = (item.parts || []).map((part) => `<span class="chip">${esc(part)}</span>`).join("");
    return `<div class="chips">${chips}</div>`;
  }
  if (item.kind === "count") return dotRow(item.dots);
  if (item.kind === "compare") {
    return `<div class="nest"><div class="card">${dotRow(item.dots)}<div>Left</div></div><div class="card">${dotRow(item.dotsB)}<div>Right</div></div></div>`;
  }
  if (item.kind === "story") {
    return `<p>${esc(item.story)}</p>${dotRow(item.dots)}<p class="fine">${item.dotsB ? `${item.dotsB} more fish in the story` : ""}</p>`;
  }
  return "";
}

function dotRow(n) {
  return `<div class="dots" aria-hidden="true">${Array.from({ length: n || 0 }, () => '<i class="dot"></i>').join("")}</div>`;
}

function choices(item) {
  return `<div class="choices">${item.choices.map((choice) => {
    const dim = play.dimmed === choice.id ? "dim" : "";
    const glow = play.reveal === choice.id ? "glow" : "";
    return `<div class="choice">
      <button type="button" class="pick ${dim} ${glow}" data-action="pick" data-id="${esc(choice.id)}">${esc(choice.emoji)} ${esc(choice.label)}</button>
    </div>`;
  }).join("")}</div>`;
}

const screens = {
  splash() {
    return `<section class="stage stage-splash">
      ${stageScene("splash")}
      ${banner("is-float")}
      <button type="button" class="fish-hit" data-action="replay" aria-label="Sunny. Tap to hear the line again."></button>
      <div class="stage-actions">
        <button class="btn xl" type="button" data-action="start">Start Adventure</button>
      </div>
    </section>`;
  },
  soon() {
    const swim = baselineProgress(db);
    return `${banner()}<article class="card" style="max-width:520px;margin:18px auto">
      <h1>Coming soon</h1>
      <p>These games open after your reef swim. ${swim.count} of ${swim.total} lagoons so far. The swim is ready whenever you are.</p>
      <button class="btn" type="button" data-action="go" data-screen="explorer">Back to the reef swim</button>
      <p><button type="button" class="parent-link" data-action="ask-unlock">Parent: unlock lessons</button></p>
    </article>`;
  },
  harbor() {
    const open = baselineProgress(db).lessonsOpen;
    const soonNode = (title, x, y) => `<div class="isle soon" style="--x:${x};--y:${y}">
      <span class="isle-name">${esc(title)}</span>
      <span class="isle-sub">Coming soon after your reef swim</span>
      <button type="button" class="parent-link" data-action="ask-unlock">Parent: unlock lessons</button>
    </div>`;
    const nodes = open
      ? [
          isle({ title: "Crystal Path", icon: "path", action: "begin", mode: "assess", module: "letters", kind: "path", x: "22%", y: "62%" }),
          isle({ title: "Explorer Check", icon: "shell", action: "go", screen: "explorer", x: "40%", y: "48%" }),
          isle({ title: "Letter practice", icon: "star", action: "begin", mode: "practice", module: "letters", kind: "practice", x: "58%", y: "58%", soft: true }),
          isle({ title: "Word practice", icon: "play", action: "begin", mode: "practice", module: "cvc", kind: "practice", x: "74%", y: "46%", soft: true }),
          isle({ title: "Reef room", icon: "home", action: "go", screen: "room", x: "28%", y: "80%" }),
          isle({ title: "Sticker lagoon", icon: "book", action: "go", screen: "stickers", x: "78%", y: "76%" }),
        ].join("")
      : [
          isle({ title: "Reef swim", icon: "shell", action: "go", screen: "explorer", x: "36%", y: "52%" }),
          soonNode("Crystal Path", "62%", "46%"),
          soonNode("Letter practice", "22%", "70%"),
          soonNode("Word practice", "78%", "68%"),
          isle({ title: "Reef room", icon: "home", action: "go", screen: "room", x: "30%", y: "84%" }),
          isle({ title: "Sticker lagoon", icon: "book", action: "go", screen: "stickers", x: "70%", y: "84%" }),
        ].join("");
    return `<section class="stage stage-map">
      ${stageScene("map")}
      ${banner("is-float")}
      <div class="hud-pills"><span class="pill">Gems ${db.inventory.gems}</span><span class="pill">Pearls ${db.inventory.pearls}</span></div>
      <nav class="lagoon" aria-label="Reef map">${nodes}</nav>
    </section>`;
  },
  play() {
    const item = play.item;
    const mod = MODULES[play.moduleId];
    const practiceHud = play.mode === "practice"
      ? `<span class="pill">🐚 ${db.inventory.pearls}</span><span class="pill">⭐ ${db.inventory.stars}</span>`
      : `<span class="pill">Check-in</span>`;
    const nextLabel = play.step >= play.steps && !(play.kind === "path" && !play.branched) ? "Finish swim" : "Next step";
    const sayIt = play.phase === "ask" && db.settings.spokenAnswers
      ? `<button class="btn" type="button" data-action="say">${play.listening ? "Listening…" : "Say it"}</button>`
      : "";
    const tapNote = play.phase === "ask" && db.settings.spokenAnswers
      ? `<p class="fine">Or tap a shell. A missed hear does not count.</p>`
      : "";
    const footer = play.phase === "ask"
      ? `<div class="dock-actions">${sayIt}<button class="btn secondary" type="button" data-action="hint">A little hint</button></div>${tapNote}`
      : play.phase === "bridge"
        ? `<button class="btn" type="button" data-action="bridge">Keep swimming</button>`
        : `<button class="btn" type="button" data-action="advance">${nextLabel}</button>`;
    const body = play.phase === "bridge"
      ? `<h2>A new lagoon</h2><p>${esc(MODULES[play.bridgeTo].childTitle)} is opening. Same adventure.</p>`
      : `<h2>${esc(item.prompt)}</h2>${itemBody(item)}${play.phase === "ask" || play.phase === "next" || play.phase === "teach" ? choices(item) : ""}
         ${item.showHint || play.phase === "teach" || play.attempts ? `<div class="hint">${esc(play.bubble)}</div>` : ""}`;
    const promptText = play.phase === "bridge"
      ? `${MODULES[play.bridgeTo].childTitle} is opening.`
      : item.prompt;
    const feedback = play.phase === "next" || play.phase === "teach"
      ? `<p class="${play.phase === "next" ? "praise-line" : "hint-line"}">${esc(play.bubble)}</p>`
      : (item.showHint || play.attempts ? `<p class="hint-line">${esc(play.bubble)}</p>` : "");
    return `<section class="quest-scene">
      <img class="stage-plate" src="themes/ut-unicorn/11-home.jpg" alt="">
      <div class="stage-veil" aria-hidden="true"></div>
      <div class="quest-top">
        <button class="btn ghost" type="button" data-action="rest">Rest</button>
        <div class="quest-ribbon">${esc(mod.childTitle)}</div>
        <div class="pills">${practiceHud}</div>
      </div>
      ${stones()}
      <div class="quest-stage">
        ${hostPortrait(play.moduleId)}
        <div class="speech-bubble">
          <p>${esc(promptText)}</p>
          ${play.phase === "bridge" || item.kind === "story" ? (item.kind === "story" ? dotRow(item.dots) : "") : itemBody(item)}
          ${feedback}
        </div>
        ${play.phase === "bridge" ? "" : `<div class="float-choices">${play.phase === "ask" || play.phase === "next" || play.phase === "teach" ? choices(item) : ""}</div>`}
      </div>
      <div class="quest-dock">${footer}</div>
    </section>`;
  },
  done() {
    const done = ui.done;
    const sticker = done.reward.sticker;
    const stickerBit = sticker
      ? `<p><span style="font-size:2rem">${sticker.emoji}</span> ${esc(sticker.name)} ${sticker.fresh ? "joined your book." : "is already in your book."}</p>`
      : "";
    const big = done.mode === "practice" && done.pearlsFromClicks > 0;
    const practiceLine = practiceFinishCopy(done.pearlsFromClicks);
    const assessLine = assessFinishCopy(done.title);
    const body = done.mode === "practice"
      ? `<p>${esc(practiceLine)}</p>
         <p>Finishing bonus: +${REWARDS.practiceCompletionPearls} pearls.</p>
         ${done.starsThisRun ? `<p>Stars from taps that landed: ${done.starsThisRun}.</p>` : ""}
         ${stickerBit}
         ${big ? `<button class="btn" type="button" data-action="cheer">Play the reef cheer</button>` : ""}`
      : `<p>${esc(assessLine)}</p>
         <p>Gem for finishing: +${done.reward.gems}.</p>
         ${stickerBit}
         <button class="btn secondary" type="button" data-action="crystal">Play a soft chime</button>`;
    const heading = done.reefOpened ? "The reef is open, Everleigh" : big ? "The reef cheers" : "Swim finished";
    const opened = done.reefOpened ? `<p>The swim is finished. New games are ready, right where you are.</p>` : "";
    return `<section class="celebrate"><div class="celebrate-layout">${banner()}<article class="shell-board">${mascot()}<h2>${heading}</h2>
      ${opened}
      <p>${esc(MOM_LINES.praise)}</p>
      <button class="btn" type="button" data-action="mom" data-line="praise">Mom's note</button>
      ${body}
      <div class="row"><button class="btn secondary" type="button" data-action="go" data-screen="stickers">Sticker lagoon</button>
      <button class="btn secondary" type="button" data-action="go" data-screen="${baselineProgress(db).lessonsOpen ? "harbor" : "explorer"}">Back to the reef</button></div></article></div></section>`;
  },
  rest() {
    return `<section class="celebrate"><div class="celebrate-layout">${banner()}<article class="shell-board">${mascot()}
      <h2>A soft rest</h2>
      <p>${esc(restCopy(ui.done.mode, ui.done.pearlsFromClicks))}</p>
      <button class="btn" type="button" data-action="go" data-screen="${baselineProgress(db).lessonsOpen ? "harbor" : "explorer"}">Back to the reef</button>
    </article></div></section>`;
  },
  consent() {
    return codePad({
      title: "A grown-up step",
      lead: "Chrome may send audio to Google so speech can be understood. A misheard try never counts. Tap always works.",
      step: ui.codePhase === "confirm"
        ? "Enter that code again to confirm."
        : "Create a parent code for this device. It is stored only as a hash in this browser.",
      button: "Accept",
    });
  },
  unlock() {
    return codePad({
      title: "Parents Corner",
      lead: "Enter the parent code for this device.",
      step: "Tap always works for the child. This page is for the grown-up.",
      button: "Open",
    });
  },
  "change-code"() {
    const step = ui.codePhase === "old"
      ? "Enter the current parent code."
      : ui.codePhase === "confirm"
        ? "Enter the new code again."
        : "Choose a new parent code.";
    return codePad({
      title: "Change parent code",
      lead: "This updates the hash on this device only.",
      step,
      button: "Continue",
    });
  },
  explorer() {
    const swim = baselineProgress(db);
    const done = new Set(swim.completed);
    const nextId = swim.remaining[0] || "";
    const spots = {
      letters: ["16%", "76%", "16%", "46%"],
      rhyme: ["27%", "68%", "14%", "57%"],
      first: ["38%", "64%", "14%", "67%"],
      blend: ["49%", "70%", "38%", "57%"],
      segment: ["60%", "70%", "62%", "57%"],
      cvc: ["71%", "64%", "84%", "46%"],
      sight: ["80%", "70%", "86%", "57%"],
      count: ["88%", "78%", "86%", "67%"],
      compare: ["78%", "84%", "50%", "67%"],
      add10: ["24%", "86%", "34%", "67%"],
      add20: ["70%", "88%", "66%", "67%"],
    };
    const icons = {
      letters: "letters", rhyme: "rhyme", first: "first", blend: "blend", segment: "segment",
      cvc: "cvc", sight: "sight", count: "count", compare: "compare", add10: "add", add20: "sub",
    };
    const shorts = {
      letters: "Letters", rhyme: "Rhymes", first: "First sound", blend: "Blend", segment: "Sounds",
      cvc: "Words", sight: "Memory", count: "Count", compare: "More", add10: "To 10", add20: "To 20",
    };
    const nodes = EXPLORER_AREAS.map((id) => {
      const [x, y, xm, ym] = spots[id];
      const state = done.has(id) ? "done" : id === nextId ? "next" : "later";
      const action = state === "later" ? "lagoon-wait" : "begin";
      return `<button type="button" class="lagoon-node is-${state}" style="--x:${x};--y:${y};--xm:${xm};--ym:${ym}" data-action="${action}" data-mode="assess" data-module="${id}" data-kind="module" aria-label="${esc(shorts[id])}, ${state}">
        <img src="assets/icons/openmoji/${icons[id]}.svg" alt="">
        <span class="node-name">${esc(shorts[id])}</span>
      </button>`;
    }).join("");
    const label = swim.count ? "Keep swimming" : "Swim the reef";
    return `<section class="stage stage-explorer">
      ${stageScene("explorer")}
      ${banner("is-float")}
      <p class="swim-pill">${swim.count} of ${swim.total} lagoons</p>
      <div class="path-map">${nodes}</div>
      <div class="stage-cta slim">
        <button class="btn" type="button" data-action="resume-swim">${label}</button>
      </div>
    </section>`;
  },
  parents() {
    const info = parentInsights(db);
    const mods = Object.values(info.modules);
    const trendClass = (trend) => trend === "needs support" ? "support" : trend === "improving" ? "improving" : trend === "steady" ? "steady" : "new";
    const pack = ui.simPack || db.lastPack;
    const packHtml = pack && pack.items && pack.items.length
      ? `<ol>${pack.items.map((item) => `<li><strong>${esc(item.prompt)}</strong> — ${esc(item.answer)} <span class="fine">(${esc(item.hint)})</span></li>`).join("")}</ol>`
      : `<p>No pack yet. Simulate an advance to build a fresh one from the on-device banks.</p>`;
    const swim = baselineProgress(db);
    const praiseCards = info.praise.slice(0, 3).map((line) => `<article class="praise-row"><span class="praise-mark" aria-hidden="true">♥</span><p>${esc(line)}</p></article>`).join("");
    const gameSource = info.games.length ? info.games : assessmentReport(db).areas.slice(0, 3).map((area) => ({ title: area.childTitle, text: area.game }));
    const gameCards = gameSource.slice(0, 3).map((game) => `<article class="game-row"><div><h3>${esc(game.title)}</h3><p>${esc(game.text)}</p></div><span class="minute-pill">2 minutes</span></article>`).join("");
    return `<section class="parent-scene">${banner()}
      <div class="parent-hero">
        <article class="praise-panel">
          <h2>What to praise today</h2>
          <p class="lede">Everleigh's effort is the prize. Short, specific praise means the world.</p>
          ${praiseCards}
          <p class="cheer-strip">You are her biggest cheerleader.</p>
          <p class="swim-note">Reef swim: ${swim.count} of ${swim.total}. ${swim.lessonsOpen ? "Lessons are open on this device." : ""}</p>
          ${swim.lessonsOpen ? "" : `<button class="btn secondary" type="button" data-action="ask-unlock">Parent: unlock lessons</button>`}
          <button class="btn secondary" type="button" data-action="lock">Back to the reef</button>
          <button type="button" class="corner-sunny sunny-flip" data-action="replay" aria-label="Sunny"></button>
        </article>
        <article class="games-panel">
          <h2>Two-minute at-home games</h2>
          <p class="lede">Quick games. Pick one and keep it light.</p>
          ${gameCards}
        </article>
      </div>
      <div class="cove parent-rest">
      <section class="card"><h2>Analytics</h2>
        <div class="stats">
          <div class="stat">Sessions finished<b>${info.sessionsCompleted}</b></div>
          <div class="stat">Time practiced<b>${esc(info.practicedLabel)}</b></div>
          <div class="stat">Adventure days<b>${info.adventureDays}</b></div>
          <div class="stat">Gems / pearls / stars<b>${info.gems} / ${info.pearls} / ${info.stars}</b></div>
        </div>
        <p class="fine">Adventure days count visits that finished a swim. A missed day never takes one away.</p>
      </section>
      <section class="card" id="assess-report"><h2>Explorer Check</h2>
        <p>These words are for you. The child sees gems for finishing, not these labels.</p>
        ${assessmentReport(db).areas.map((area) => `<p><strong>${esc(area.childTitle)}</strong> — ${esc(area.status)}<br><span class="fine">${esc(area.standard)} ${esc(area.phrase)}</span><br>Praise: ${esc(area.cheer)}<br>2 minutes: ${esc(area.game)}</p>`).join("")}
        <h3>Checks over time</h3>
        ${(db.checkHistory || []).length
          ? [...db.checkHistory].reverse().slice(0, 24).map((row) => `<p>${esc(row.at.slice(0, 10))} · ${esc(MODULES[row.moduleId]?.parentTitle || row.moduleId)} · ${esc(row.status)}</p>`).join("")
          : `<p>No finished check yet.</p>`}
        <div class="row">
          <button class="btn secondary" type="button" data-action="export-checks">Download notes</button>
          <button class="btn secondary" type="button" data-action="print-checks">Print</button>
        </div>
      </section>
      <section class="card"><h2>Estimated bands</h2>
        ${mods.map((mod) => `<p><strong>${esc(mod.childTitle)}</strong> — ${esc(mod.phrase)}
          <span class="trend ${trendClass(mod.trend)}">${esc(mod.trendPlain)}</span>
          · finished ${mod.completions}</p>`).join("")}
      </section>
      <section class="card"><h2>Working on now</h2><p>${esc(info.workingOn)}</p>
        <h3>Where a hand helps</h3><p>${esc(info.needsHelp)}</p></section>
      <section class="card"><h2>Note for school</h2>
        <textarea id="teacher-card" class="share" readonly>${esc(info.teacherText)}</textarea>
        <button class="btn" type="button" data-action="copy">${ui.copied ? "Copied" : "Copy note"}</button>
        <p class="fine">No photos and no item-by-item list. The note does not name anyone. Copy it yourself if you want to share it. This page does not send it anywhere. It complements school evaluation and does not replace it.</p>
      </section>
      <section class="card"><h2>What to praise</h2>
        <p>${esc(MOM_LINES.welcome)}</p>
        <button class="btn secondary" type="button" data-action="mom" data-line="welcome">Welcome note</button>
        <p>${esc(MOM_LINES.praise)}</p>
        <button class="btn secondary" type="button" data-action="mom" data-line="praise">Mom's note</button>
        <p class="fine">Mom's lines play from recorded clips. If a clip is missing, the words stay on screen and nothing is read aloud.</p>
        ${info.praise.map((line) => `<p>${esc(line)}</p>`).join("")}
        <h3>Two-minute home games</h3>
        ${info.games.map((game) => `<p><strong>${esc(game.title)}</strong><br>${esc(game.text)}</p>`).join("")}
      </section>
      <section class="card"><h2>Fresh pack preview</h2>
        <p>When she advances, generatePack builds a new set on this device. This button pretends an advance.</p>
        <button class="btn" type="button" data-action="sim">Simulate an advance</button>
        ${packHtml}
      </section>
      <section class="card"><h2>One-page guide</h2>
        <textarea id="parent-guide" class="share" readonly>${esc(parentGuide())}</textarea>
        <button class="btn secondary" type="button" data-action="copy-guide">Copy guide</button>
      </section>
      <section class="card"><h2>Spoken answers</h2>
        <p>The browser asks for the microphone the first time it is used. Tap always works. A missed hear never counts. The mic button next to Parents turns this off.</p>
        <p>Voice may be sent to Google to be understood.</p>
        <button class="btn ${db.settings.spokenAnswers ? "" : "secondary"}" type="button" data-action="spoken" aria-pressed="${db.settings.spokenAnswers ? "true" : "false"}">Spoken answers: ${db.settings.spokenAnswers ? "on" : "off"}</button>
        <button class="btn secondary" type="button" data-action="change-code">Change parent code</button>
        ${browserCanListen() ? "" : `<p class="fine">This browser has no speech listener. Taps still work.</p>`}
        <p><button class="btn secondary" type="button" data-action="mom" data-line="praise">Mom's note</button></p>
      </section>
      <section class="card"><h2>Move my progress</h2>
        <p>Each browser is separate until you restore a backup. No account. The file or code stays with you.</p>
        <div class="row">
          <button class="btn" type="button" data-action="make-code">Make a backup code</button>
          <button class="btn secondary" type="button" data-action="export">Download JSON</button>
          ${ui.backupCode ? `<button class="btn secondary" type="button" data-action="copy-code">Copy code</button>` : ""}
        </div>
        ${ui.backupCode ? `<textarea id="backup-code" class="share" readonly>${esc(ui.backupCode)}</textarea>` : ""}
        <label>Paste a code or JSON
          <textarea id="restore-text" class="share" placeholder="Paste backup here"></textarea>
        </label>
        <div class="row">
          <button class="btn" type="button" data-action="restore-code">Restore on this device</button>
        </div>
        <label>Or choose a JSON file <input id="restore-file" type="file" accept="application/json,.json"></label>
        <p>${esc(ui.restoreNote)}</p>
      </section>
      <section class="card"><h2>This device</h2>
        <div class="row">
          <button class="btn secondary" type="button" data-action="toggle" data-key="voice">Voice ${db.settings.voice ? "on" : "off"}</button>
          <button class="btn secondary" type="button" data-action="toggle" data-key="sfx">Sounds ${db.settings.sfx ? "on" : "off"}</button>
          <button class="btn secondary" type="button" data-action="toggle" data-key="reducedMotion">Calm motion ${db.settings.reducedMotion ? "on" : "off"}</button>
          <button class="btn secondary" type="button" data-action="toggle" data-key="contrast">Contrast ${db.settings.contrast ? "on" : "off"}</button>
        </div>
        <p>Room colors</p>
        <div class="row">
          <button class="swatch on" style="background:#ff8200" type="button" data-action="theme" data-theme="orange" aria-label="Tennessee Orange"></button>
          <button class="swatch" style="background:#fff" type="button" data-action="theme" data-theme="white" aria-label="White"></button>
          <button class="swatch" style="background:#c5ced4" type="button" data-action="theme" data-theme="gray" aria-label="Soft Gray"></button>
        </div>
        ${ui.confirmReset
          ? `<p>This clears reef memory on this device only.</p><button class="btn secondary" type="button" data-action="reset-yes">Yes, clear it</button>`
          : `<button class="btn secondary" type="button" data-action="reset-ask">Clear reef memory</button>`}
        <p class="fine">Progress and the unlock stay in localStorage on this browser until you move a backup. Nothing is uploaded.</p>
      </section>
    </div></section>`;
  },
  room() {
    const owned = Object.values(STICKERS).filter((sticker) => db.inventory.stickers.includes(sticker.id));
    const line = "Decor colors are Tennessee Orange, white, and soft gray. Stickers show up when a swim is finished.";
    return `<section class="nook"><div class="nook-layout">${banner()}
      ${mascot()}
      <article class="dock">
      <h1>Reef room</h1>
      <p>${esc(line)}</p>
      <div class="row">
        <button class="swatch" style="background:#ff8200" type="button" data-action="theme" data-theme="orange" aria-label="Tennessee Orange"></button>
        <button class="swatch" style="background:#fff" type="button" data-action="theme" data-theme="white" aria-label="White"></button>
        <button class="swatch" style="background:#d5dde3" type="button" data-action="theme" data-theme="gray" aria-label="Soft Gray"></button>
      </div>
      <div class="shelf">${owned.map((sticker) => shelf(sticker)).join("") || `<p class="fine">Stickers swim in after a finished adventure.</p>`}</div>
      <button class="btn secondary" type="button" data-action="go" data-screen="harbor">Back to the reef</button>
    </article></div></section>`;
  },
  stickers() {
    const line = "Stickers appear when a swim is finished. Empty shells are still swimming.";
    return `<section class="nook"><div class="nook-layout">${banner()}
      ${mascot()}
      <article class="dock">
      <h1>Sticker book</h1>
      <p>Finished swims only. ${esc(line)}</p>
      <div class="shelf">${Object.values(STICKERS).map((sticker) => shelf(sticker)).join("")}</div>
      <button class="btn secondary" type="button" data-action="go" data-screen="harbor">Back to the reef</button>
    </article></div></section>`;
  },
};

function shelf(sticker) {
  const owned = db.inventory.stickers.includes(sticker.id);
  if (!owned) return `<div class="sticker-locked"><span>🐚</span><div>Still swimming</div></div>`;
  return `<div class="sticker"><span>${sticker.emoji}</span><div>${esc(sticker.name)}</div></div>`;
}

function codePad({ title, lead, step, button }) {
  const dots = "●".repeat(ui.pin.length).padEnd(4, "○");
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "del", "0", "ok"];
  return `${banner()}<article class="card" style="max-width:460px;margin:0 auto">
    <h1>${esc(title)}</h1>
    <p>${esc(lead)}</p>
    <p>${esc(step)}</p>
    <p class="pin-dots" aria-label="code progress">${dots}</p>
    <div class="pad">${keys.map((key) => `<button type="button" data-action="pin" data-key="${key}">${key === "del" ? "⌫" : key === "ok" ? "OK" : key}</button>`).join("")}</div>
    <button class="btn" type="button" data-action="accept-gate">${esc(button)}</button>
    <p>${esc(ui.pinMsg)}</p>
  </article>`;
}

document.getElementById("mic-toggle").addEventListener("click", () => {
  db.settings.spokenAnswers = !db.settings.spokenAnswers;
  if (!db.settings.spokenAnswers) haltListening();
  save(db);
  syncChrome();
  if (ui.screen === "play") render();
});
document.getElementById("voice-toggle").addEventListener("click", () => {
  db.settings.voice = !db.settings.voice;
  if (!db.settings.voice) hushMouth();
  save(db);
  syncChrome();
  if (db.settings.voice && audioUnlocked) {
    spokenKey = "";
    offerSpeech();
  }
});
document.getElementById("cc-toggle").addEventListener("click", () => {
  db.settings.captions = db.settings.captions === false;
  save(db);
  syncChrome();
});
document.addEventListener("pointerdown", armAudio, { capture: true });
document.addEventListener("keydown", armAudio, { capture: true });

const shot = sessionStorage.getItem("reef-shot");
if (shot) sessionStorage.removeItem("reef-shot");
if (shot && shot.startsWith("play:")) {
  const [, mode, module, kind] = shot.split(":");
  begin(mode, module, kind || "module");
} else {
  if (shot === "parents-report") ui.screen = "parents";
  else if (shot) ui.screen = shot;
  render();
}
if ("serviceWorker" in navigator) {
  const root = new URL("../", import.meta.url);
  navigator.serviceWorker.register(new URL("sw.js", root), { scope: root.href, updateViaCache: "none" })
    .then((reg) => reg.update())
    .catch(() => {});
}
