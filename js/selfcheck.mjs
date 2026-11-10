import { speechMatchesAnswer } from "./voice.js";
import { sha256Hex } from "./gate.js";
import {
  BANDS,
  REWARDS,
  MODULES,
  freshProgress,
  takeNextItem,
  recordAnswer,
  generatePack,
  parentInsights,
  emptyState,
  reefTitle,
  baselineProgress,
  noteAreaCheck,
  EXPLORER_AREAS,
  assessFinishCopy,
  practiceFinishCopy,
  finishRun,
  awardPracticeCorrect,
  noteItem,
} from "./engine.js";

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    process.exitCode = 1;
  } else console.log("ok", msg);
}

const forbidden = /\b(wrong|failed|failure|behind|dumb|incorrect|kindergarten|grade|%)\b/i;

let progress = freshProgress("letters");
assert(progress.level === 1, "starts mid-easy");
let a = takeNextItem(progress);
assert(a.item.guaranteed && a.item.level === 0, "first item is a guaranteed win");
progress = recordAnswer(a.progress, a.item, true, "assess").progress;
let b = takeNextItem(progress);
assert(b.item.guaranteed, "second item is a guaranteed win");
progress = recordAnswer(b.progress, b.item, true, "assess").progress;
let c = takeNextItem(progress);
assert(!c.item.guaranteed && c.item.level === 1, "third item returns to mid-easy");

let eased = freshProgress("cvc", 2);
eased.guaranteedLeft = 0;
let item = takeNextItem(eased).item;
let rec = recordAnswer(eased, item, false, "assess");
eased = rec.progress;
item = takeNextItem(eased).item;
rec = recordAnswer(eased, item, false, "assess");
assert(rec.event === "ease" && rec.progress.level === 1, "two misses ease one band");
const hinted = takeNextItem(rec.progress);
assert(hinted.item.showHint && hinted.item.level === 1, "easier item carries a soft hint");

let climb = freshProgress("letters", 1);
climb.guaranteedLeft = 0;
climb.tier = "ceiling";
for (let i = 0; i < 3; i += 1) {
  const taken = takeNextItem(climb);
  rec = recordAnswer(taken.progress, taken.item, true, "assess");
  climb = rec.progress;
}
assert(climb.holdForSkip, "three correct at ceiling holds for a possible skip");
{
  const taken = takeNextItem(climb);
  rec = recordAnswer(taken.progress, taken.item, true, "assess");
}
assert(rec.event === "skip" && rec.progress.level === 3, "fourth correct skips ahead a band");

const packA = generatePack("ELA-K-PH-02", { packNumber: 1, difficulty: 1, count: 4 });
const packB = generatePack("ELA-K-PH-02", {
  packNumber: 2,
  difficulty: 2,
  count: 4,
  avoidIds: packA.items.map((item) => item.key),
});
assert(packA.items.length === 4 && packA.items.every((item) => item.prompt && item.answer && item.hint && item.audio_key), "pack shape");
assert(packB.items.some((item) => !packA.items.find((other) => other.key === item.key)), "advance builds fresh items");
for (const id of Object.keys(MODULES)) {
  const pack = generatePack(MODULES[id].skillId, { count: 3, packNumber: 3 });
  assert(pack.items.length === 3, `${id} generates`);
}

assert(REWARDS.practicePearlPerCorrect > REWARDS.practiceCompletionPearls, "accuracy pays more than finishing");
const state = emptyState();
let practice = freshProgress("cvc");
practice.guaranteedLeft = 0;
for (let i = 0; i < 3; i += 1) {
  const taken = takeNextItem(practice);
  noteItem(state, taken.progress, true, "stay", "practice");
  awardPracticeCorrect(state, i + 1);
  practice = taken.progress;
}
const reward = finishRun(state, { mode: "practice", moduleIds: ["cvc"], ms: 120000, completed: true });
assert(state.inventory.pearls === 3 * REWARDS.practicePearlPerCorrect + reward.pearls, "practice keeps click pearls plus a smaller bonus");
const assess = emptyState();
finishRun(assess, { mode: "assess", moduleIds: ["letters"], ms: 60000, completed: true });
assert(assess.inventory.gems === 1 && assess.inventory.pearls === 0, "assessment pays a gem for completion only");
const copy = `${assessFinishCopy("Letter Lands")} ${practiceFinishCopy(9)}`;
assert(!forbidden.test(copy), "finish copy stays gentle");
const insights = parentInsights(state);
assert(!insights.teacherText.includes("%"), "teacher note has no percent");
assert(insights.modules.cvc.phrase.length > 0, "parent band phrase");
assert(BANDS.includes("sprout"), "bands exist");
const hintTexts = new Set();
const slots = new Set();
let varied = freshProgress("letters", 1);
varied.guaranteedLeft = 0;
for (let i = 0; i < 14; i += 1) {
  varied.hintArmed = i % 4 === 0;
  const taken = takeNextItem(varied, { salt: 100 + i * 13, variant: i });
  hintTexts.add(taken.item.hint);
  slots.add(taken.item.choices.findIndex((choice) => choice.id === taken.item.answer));
  varied = taken.progress;
}
assert(hintTexts.size >= 3, "hints are not one repeated line");
assert(slots.size >= 2, "the answer is not always in the same slot");
assert(parentInsights(emptyState()).teacherText.startsWith("Everleigh's Rocky Top Reef"), "school note uses the app title");
assert(reefTitle() === "Everleigh's Rocky Top Reef", "title is Everleigh's Rocky Top Reef");
const swim = emptyState();
assert(baselineProgress(swim).count === 0 && !baselineProgress(swim).lessonsOpen, "reef swim starts closed");
for (const id of EXPLORER_AREAS) noteAreaCheck(swim, id);
assert(baselineProgress(swim).finished && baselineProgress(swim).lessonsOpen, "finishing every lagoon opens lessons");
const early = emptyState();
early.settings.lessonsUnlocked = true;
assert(baselineProgress(early).lessonsOpen && !baselineProgress(early).finished, "parent unlock opens lessons early");
assert(emptyState().settings.spokenAnswers === true, "spoken answers start on");
const letterItem = {
  answer: "m",
  choices: [
    { id: "m", label: "mmm", speak: "mmm, like moon" },
    { id: "s", label: "sss", speak: "sss, like sun" },
  ],
};
assert(speechMatchesAnswer(["mmm"], letterItem), "hears the matching sound");
assert(speechMatchesAnswer(["moon"], letterItem), "hears the picture word for that sound");
assert(!speechMatchesAnswer(["sun"], letterItem), "a different word is not treated as the answer");
assert(!speechMatchesAnswer([""], letterItem), "silence is not an answer");
const sampleHash = await sha256Hex("reef-gate");
assert(/^[0-9a-f]{64}$/.test(sampleHash), "sha256 returns hex");
assert(await sha256Hex("reef-gate") === sampleHash, "sha256 is stable");
assert(sampleHash !== await sha256Hex("reef-gate-other"), "different text hashes differently");

if (process.exitCode) console.error("selfcheck failed");
else console.log("all selfchecks passed");
