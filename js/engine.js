/**
 * Local adaptive engine for the reef demo.
 *
 * Demo banks only: letter sounds, sound spies, CVC, a few memory words,
 * count-to-10, add/sub stories. After Adventure Day 1, add a bank per new
 * skill id (digraphs, blends, silent-e, within 20) and keep generatePack /
 * generateNextItem. Nothing here is downloaded.
 *
 * Assessment rewards completion only. Practice rewards correct answers more
 * than finishing. Child-facing strings never carry a score.
 */

export const BANDS = ["seedling", "sprout", "sapling", "explorer"];

export const REWARDS = {
  practicePearlPerCorrect: 3,
  practiceStarEvery: 3,
  practiceCompletionPearls: 2,
  assessCompletionGems: 1,
};

export const MODULES = {
  letters: {
    id: "letters",
    skillId: "ELA-K-PH-01",
    activityType: "letter-sound",
    subject: "Reading",
    childTitle: "Letter Lands",
    parentTitle: "Letter sounds",
    blurb: "Meet the letter friends",
    mascotLine: "Let’s visit letter friends in the lagoon.",
    deep: true,
    startLevel: 1,
    assessSteps: 6,
  },
  pa: {
    id: "pa",
    skillId: "ELA-K-PA-04",
    activityType: "sound-spies",
    subject: "Reading",
    childTitle: "Sound Spies",
    parentTitle: "Listening for sounds",
    blurb: "Catch a sneaky sound",
    mascotLine: "Let’s listen for the first sound, nice and slow.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
  },
  cvc: {
    id: "cvc",
    skillId: "ELA-K-PH-02",
    activityType: "cvc-blend",
    subject: "Reading",
    childTitle: "Word Currents",
    parentTitle: "Blending little words",
    blurb: "Stretch sounds into words",
    mascotLine: "These little words are swimming by. Let’s blend them.",
    deep: true,
    startLevel: 1,
    assessSteps: 6,
  },
  sight: {
    id: "sight",
    skillId: "ELA-K-SW-01",
    activityType: "sight-word",
    subject: "Reading",
    childTitle: "Star Trail",
    parentTitle: "Memory words",
    blurb: "Wave at friendly words",
    mascotLine: "Some words we remember by sight. No rush.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
  },
  count: {
    id: "count",
    skillId: "MATH-K-CC-02",
    activityType: "count-to-10",
    subject: "Numbers",
    childTitle: "Number Nest",
    parentTitle: "Counting to 10",
    blurb: "Count the pearls",
    mascotLine: "Count the pearls with me, one shell at a time.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
  },
  addsub: {
    id: "addsub",
    skillId: "MATH-K-OA-01",
    activityType: "add-sub-story",
    subject: "Numbers",
    childTitle: "Power Pairs",
    parentTitle: "Putting together and taking away",
    blurb: "Tiny fish stories",
    mascotLine: "A tiny fish story. We can use the fish to help.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Add and subtract within 10, with objects.",
    game: "Tell a 2-minute fish story with spoons. Let her move them as she adds or takes away.",
    cheer: "Praise staying with the story, even when she counts again.",
  },
  rhyme: {
    id: "rhyme",
    skillId: "ELA-K-PA-01",
    activityType: "rhyme",
    subject: "Reading",
    childTitle: "Rhyme Reef",
    parentTitle: "Rhymes",
    blurb: "Words that end the same",
    mascotLine: "Let’s listen for the first sound, nice and slow.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Notice and say rhyming words.",
    game: "Say cat. Ask which ends the same: hat or sun. Cheer the ending sound.",
    cheer: "Praise listening for the ending, not the speed.",
  },
  first: {
    id: "first",
    skillId: "ELA-K-PA-04",
    activityType: "first-sound",
    subject: "Reading",
    childTitle: "First Sound Cove",
    parentTitle: "First sounds",
    blurb: "Catch the first sound",
    mascotLine: "Let’s listen for the first sound, nice and slow.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Hear the first sound in a spoken word.",
    game: "Say moon. Ask her to catch only the first sound, /m/.",
    cheer: "Praise catching the start of the word.",
  },
  blend: {
    id: "blend",
    skillId: "ELA-K-PA-05",
    activityType: "blend",
    subject: "Reading",
    childTitle: "Blend Bay",
    parentTitle: "Blending sounds",
    blurb: "Scoop sounds into a word",
    mascotLine: "These little words are swimming by. Let’s blend them.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Blend sounds into a spoken word.",
    game: "Say /s/ /u/ /n/ slowly. She scoops them into sun.",
    cheer: "Praise stretching the sounds all the way through.",
  },
  segment: {
    id: "segment",
    skillId: "ELA-K-PA-06",
    activityType: "segment",
    subject: "Reading",
    childTitle: "Sound Split",
    parentTitle: "Segmenting sounds",
    blurb: "Pull a word into sounds",
    mascotLine: "Let’s listen for the first sound, nice and slow.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Pull a short word into its sounds.",
    game: "Say mat. Tap one finger for each sound: /m/ /a/ /t/.",
    cheer: "Praise each sound she can hold, one at a time.",
  },
  compare: {
    id: "compare",
    skillId: "MATH-K-CC-04",
    activityType: "compare",
    subject: "Numbers",
    childTitle: "More or Less",
    parentTitle: "Comparing amounts",
    blurb: "Which nest has more",
    mascotLine: "Count the pearls with me, one shell at a time.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Compare two groups: more, less, or the same.",
    game: "Two plates of spoons. Ask which has more. Count together if it helps.",
    cheer: "Praise counting both piles before choosing.",
  },
  add10: {
    id: "add10",
    skillId: "MATH-K-OA-10",
    activityType: "add-within-10",
    subject: "Numbers",
    childTitle: "Fish Stories to 10",
    parentTitle: "Add and subtract within 10",
    blurb: "Stories inside ten",
    mascotLine: "A tiny fish story. We can use the fish to help.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Add and subtract within 10, with objects.",
    game: "Use up to 10 spoons. Tell one joining story and one leaving story.",
    cheer: "Praise using objects instead of rushing.",
  },
  add20: {
    id: "add20",
    skillId: "MATH-1-OA-01",
    activityType: "add-within-20",
    subject: "Numbers",
    childTitle: "Deeper Fish Stories",
    parentTitle: "Add and subtract within 20",
    blurb: "Stories inside twenty",
    mascotLine: "A tiny fish story. We can use the fish to help.",
    deep: false,
    startLevel: 1,
    assessSteps: 5,
    standard: "Add and subtract within 20, with a strategy.",
    game: "Start at a number up to 20 and count on or back with fingers or spoons.",
    cheer: "Praise a strategy, like counting on, not a race.",
  },
};

export const EXPLORER_AREAS = ["letters", "rhyme", "first", "blend", "segment", "cvc", "sight", "count", "compare", "add10", "add20"];

const SKILL_TO_MODULE = Object.fromEntries(
  Object.values(MODULES).map((m) => [m.skillId, m.id])
);

const BAND_PHRASE = {
  letters: {
    seedling: "sounds like early letter sounds",
    sprout: "sounds like letter sounds are growing",
    sapling: "sounds like letter sounds are growing strong",
    explorer: "sounds like she is ready to stretch sounds into little words",
  },
  pa: {
    seedling: "sounds like early listening — first sounds are just waking up",
    sprout: "sounds like listening for sounds is growing",
    sapling: "sounds like first and last sounds are getting clearer",
    explorer: "sounds like she can stretch a little word into its sounds",
  },
  cvc: {
    seedling: "sounds like blending is just waking up",
    sprout: "sounds like little words are growing",
    sapling: "sounds like she can blend many little words",
    explorer: "sounds like she is ready for trickier reef passwords",
  },
  sight: {
    seedling: "sounds like early memory words",
    sprout: "sounds like memory words are growing",
    sapling: "sounds like memory words are growing strong",
    explorer: "sounds like friendly words are quick to spot",
  },
  count: {
    seedling: "sounds like early counting — small piles of pearls",
    sprout: "sounds like counting is growing",
    sapling: "sounds like counting toward ten is growing strong",
    explorer: "sounds like she is ready to compare piles",
  },
  addsub: {
    seedling: "sounds like early putting-together, within five",
    sprout: "sounds like putting together and taking away is growing",
    sapling: "sounds like stories within ten are growing strong",
    explorer: "sounds like she is ready for slightly bigger fish stories",
  },
};

export const CHEERS = [
  "You stretched those sounds!",
  "Your ear caught that one!",
  "That swam right into place!",
  "I like how you tried that!",
];

export const NUDGE = "Ooh, that one tricked me too — let’s sneak up on it.";
export const EASE_LINE = "Let’s float to a cozier current. I’ll hum a hint.";
export const HARDER_LINE = "A deeper current is opening. We can swim it together.";
export const SKIP_LINE = "The path opened a wider lagoon. Let’s peek together.";

const HELP = {
  letters: "Name a letter, hum its sound, and let her tap the shell that matches.",
  pa: "Say a word, then hum only the first sound and let her find it.",
  cvc: "Hum each sound, then say the word together. A hint is a kindness.",
  sight: "Show the word, read it once, and let her tap the twin. No timer.",
  count: "Move one pearl for each number, out loud, up to ten.",
  addsub: "Act the fish story with spoons. The equation can stay hidden.",
};

export function cleanNickname(value) {
  const nick = String(value || "").trim().slice(0, 24);
  if (!nick || /^demo$/i.test(nick)) return "";
  return nick;
}

export const APP_TITLE = "Everleigh's Rocky Top Reef";

export function reefTitle() {
  return APP_TITLE;
}

export function emptyState() {
  return {
    v: 1,
    settings: {
      voice: true,
      captions: true,
      sfx: true,
      reducedMotion: false,
      contrast: false,
      theme: "orange",
      spokenAnswers: true,
      gateAccepted: false,
      parentCodeHash: "",
      lessonsUnlocked: false,
      nickname: "",
    },
    inventory: { gems: 0, pearls: 0, stars: 0, stickers: [] },
    checkHistory: [],
    adventureDays: [],
    placement: {},
    events: [],
    sessions: [],
    packIndex: {},
    lastPack: null,
    moduleCompletions: {},
  };
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(a) {
  let t = a >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function freshProgress(moduleId, savedLevel) {
  const mod = MODULES[moduleId];
  if (!mod) throw new Error(`Unknown module ${moduleId}`);
  const level = clamp(savedLevel ?? mod.startLevel, 0, 3);
  return {
    moduleId,
    level,
    tier: "easy",
    band: BANDS[level],
    asked: 0,
    correctCount: 0,
    streak: 0,
    missStreak: 0,
    recent: [],
    cooldown: 0,
    bumps: 0,
    drops: 0,
    skips: 0,
    guaranteedLeft: 2,
    hintArmed: false,
    holdForSkip: false,
    seenKeys: [],
    lastKey: null,
    guaranteedAsked: 0,
  };
}

function remember(list, key) {
  const next = [...list, key];
  return next.slice(-24);
}

function capFor(mode) {
  return mode === "practice" ? 2 : 4;
}

/**
 * One outcome per item (not per tap). First gentle retry stays in the UI.
 * mode: "assess" | "practice" — practice caps climbs a little sooner.
 */
export function recordAnswer(progress, item, correct, mode = "assess") {
  const p = clone(progress);
  const cap = capFor(mode);
  p.asked += 1;
  p.recent = [...p.recent, Boolean(correct)].slice(-6);
  if (correct) p.correctCount += 1;
  if (item.guaranteed) p.guaranteedAsked += 1;

  let event = "stay";

  if (p.holdForSkip) {
    p.holdForSkip = false;
    if (correct) {
      p.missStreak = 0;
      if (p.bumps < cap && p.level < 3) {
        p.level = Math.min(3, p.level + 2);
        p.tier = "easy";
        p.streak = 0;
        p.skips += 1;
        p.bumps += 1;
        event = "skip";
      } else {
        p.streak = 0;
        event = "ceiling";
      }
    } else {
      p.streak = 0;
      p.missStreak = 1;
      if (p.bumps < cap && p.level < 3) {
        p.level += 1;
        p.tier = "easy";
        p.bumps += 1;
        event = "bump";
      } else {
        event = "stay";
      }
    }
    p.band = BANDS[p.level];
    p.seenKeys = remember(p.seenKeys, item.key);
    return { progress: p, event, line: lineFor(event, correct) };
  }

  if (item.guaranteed) {
    if (correct) {
      p.missStreak = 0;
      p.guaranteedLeft = Math.max(0, p.guaranteedLeft - 1);
      event = "warm";
    } else {
      p.streak = 0;
      p.missStreak += 1;
      p.guaranteedLeft = Math.max(0, p.guaranteedLeft - 1);
      event = p.missStreak >= 2 ? armEase(p, cap) : "retry";
    }
    p.band = BANDS[p.level];
    p.seenKeys = remember(p.seenKeys, item.key);
    return { progress: p, event, line: lineFor(event, correct) };
  }

  if (correct) {
    p.streak += 1;
    p.missStreak = 0;
    if (p.cooldown > 0) p.cooldown -= 1;
    if (p.cooldown === 0 && p.bumps < cap) {
      if (p.tier === "easy" && p.streak >= 3) {
        p.tier = "ceiling";
        p.streak = 0;
        p.bumps += 1;
        event = "harder";
      } else if (p.tier === "ceiling" && p.streak >= 4 && p.level < 3) {
        p.level = Math.min(3, p.level + 2);
        p.tier = "easy";
        p.streak = 0;
        p.skips += 1;
        p.bumps += 1;
        event = "skip";
      } else if (p.tier === "ceiling" && p.streak >= 3 && p.level < 3) {
        p.holdForSkip = true;
        event = "poised";
      } else if (p.tier === "ceiling" && p.streak >= 3 && p.level >= 3) {
        p.streak = 0;
        event = "ceiling";
      } else {
        event = "stay";
      }
    } else {
      event = "stay";
    }
  } else {
    p.streak = 0;
    p.missStreak += 1;
    const acc = p.recent.filter(Boolean).length / p.recent.length;
    const dropping = p.recent.length >= 4 && acc < 0.5;
    if (p.missStreak >= 2 || dropping) event = armEase(p, cap);
    else event = "retry";
  }

  p.band = BANDS[p.level];
  p.seenKeys = remember(p.seenKeys, item.key);
  return { progress: p, event, line: lineFor(event, correct) };
}

function armEase(p, cap) {
  if (p.drops < cap && p.level > 0) {
    p.level -= 1;
    p.drops += 1;
  }
  p.tier = "easy";
  p.hintArmed = true;
  p.missStreak = 0;
  p.streak = 0;
  p.holdForSkip = false;
  p.cooldown = 2;
  return "ease";
}

export function lineFor(event, correct) {
  if (event === "ease") return EASE_LINE;
  if (event === "harder" || event === "bump") return HARDER_LINE;
  if (event === "skip") return SKIP_LINE;
  if (event === "retry") return NUDGE;
  if (correct) return CHEERS[0];
  return "Let’s peek at the next shell together.";
}

export function takeNextItem(progress, options = {}) {
  const item = generateNextItem(progress.moduleId, progress, options);
  const p = clone(progress);
  p.hintArmed = false;
  p.lastKey = item.key;
  p.seenKeys = remember(p.seenKeys, item.key);
  return { progress: p, item };
}

export function generateNextItem(moduleId, progress, options = {}) {
  const mod = MODULES[moduleId];
  if (!mod) {
    return {
      id: "closed",
      key: "closed",
      module: moduleId,
      skill_id: skillIdOr(moduleId),
      activity_type: "unopened",
      prompt: "That lagoon opens after a check-in.",
      answer: "",
      hint: "We can swim somewhere else.",
      audio_key: "closed",
      choices: [],
      kind: "letter",
      level: 0,
      tier: "easy",
      guaranteed: false,
      showHint: false,
      ceiling: false,
      speak: "That lagoon opens later.",
      lead: "Let’s pick another lagoon.",
      worked: "We can come back.",
    };
  }
  const salt = options.salt ?? progress.asked;
  const seedKey = [
    moduleId,
    progress.level,
    progress.tier,
    salt,
    progress.seenKeys.length,
    options.packNumber ?? 0,
    options.variant ?? 0,
    progress.guaranteedLeft,
  ].join("|");
  const rng = mulberry32(hashString(seedKey));
  const guaranteed = progress.guaranteedLeft > 0 && !options.pack;
  const level = guaranteed ? 0 : clamp(progress.level, 0, 3);
  const tier = guaranteed ? "easy" : progress.tier;
  const showHint = Boolean(progress.hintArmed) && !guaranteed;
  const built = BUILDERS[moduleId](rng, {
    level,
    tier,
    guaranteed,
    showHint,
    support: showHint || level === 0 ? "high" : "normal",
    avoid: new Set(progress.seenKeys.slice(-8)),
    lastKey: progress.lastKey,
  });
  built.module = moduleId;
  built.skill_id = mod.skillId;
  built.activity_type = mod.activityType;
  built.level = level;
  built.tier = tier;
  built.guaranteed = guaranteed;
  built.showHint = showHint;
  built.ceiling = tier === "ceiling" || level === 3;
  built.audio_key = built.audio_key || `${moduleId}-${built.key}`;
  return built;
}

export function generatePack(skillId, options = {}) {
  const moduleId = MODULES[skillId] ? skillId : SKILL_TO_MODULE[skillId];
  if (!moduleId || !MODULES[moduleId]) {
    return {
      skill_id: skillId,
      activity_type: "unopened",
      items: [],
      mascot_line: "That reef path opens after the adventure check.",
      reward: { gemsOnComplete: 0, pearlsOnComplete: 0 },
      pack_number: options.packNumber ?? 1,
      difficulty: options.difficulty ?? 1,
    };
  }
  const mod = MODULES[moduleId];
  const count = options.count ?? 4;
  const level = clamp(options.difficulty ?? mod.startLevel, 0, 3);
  const avoid = new Set(options.avoidIds || []);
  let prog = freshProgress(moduleId, level);
  prog.guaranteedLeft = 0;
  prog.tier = options.tier === "ceiling" ? "ceiling" : "easy";
  prog.level = level;
  prog.band = BANDS[level];
  const items = [];
  let guard = 0;
  while (items.length < count && guard < count * 8) {
    guard += 1;
    const taken = takeNextItem(prog, {
      salt: (options.packNumber ?? 1) * 100 + guard,
      packNumber: options.packNumber ?? 1,
      variant: guard,
      pack: true,
    });
    prog = taken.progress;
    if (avoid.has(taken.item.id) || avoid.has(taken.item.key)) continue;
    items.push(taken.item);
    avoid.add(taken.item.key);
  }
  return {
    skill_id: mod.skillId,
    activity_type: mod.activityType,
    items: items.map(publicItem),
    mascot_line: mod.mascotLine,
    reward: {
      gemsOnComplete: 0,
      pearlsOnComplete: REWARDS.practiceCompletionPearls,
      pearlsPerCorrect: REWARDS.practicePearlPerCorrect,
      celebration: "reef-cheer",
    },
    pack_number: options.packNumber ?? 1,
    difficulty: level,
    module: moduleId,
  };
}

function publicItem(item) {
  return {
    id: item.id,
    key: item.key,
    prompt: item.prompt,
    answer: item.answer,
    hint: item.hint,
    audio_key: item.audio_key,
    choices: item.choices,
    kind: item.kind,
    display: item.display,
    parts: item.parts,
    emoji: item.emoji,
    dots: item.dots,
    dotsB: item.dotsB,
    story: item.story,
    speak: item.speak,
    lead: item.lead,
    worked: item.worked,
    showHint: item.showHint,
    level: item.level,
    tier: item.tier,
    guaranteed: false,
    ceiling: item.ceiling,
    module: item.module,
    skill_id: item.skill_id,
    activity_type: item.activity_type,
  };
}

export function suggestBranch(moduleId, progress) {
  if (moduleId !== "letters") return null;
  const scored = progress.asked - progress.guaranteedAsked;
  if (scored < 2) return null;
  if (progress.band === "seedling") return null;
  if (progress.band === "sprout") return "pa";
  return "cvc";
}

export function noteItem(state, progress, correct, event, mode) {
  state.events.push({
    t: "item",
    at: new Date().toISOString(),
    module: progress.moduleId,
    mode,
    correct: Boolean(correct),
    level: progress.level,
    kind: event,
  });
  if (state.events.length > 400) state.events.splice(0, state.events.length - 400);
  state.placement[progress.moduleId] = {
    level: progress.level,
    band: progress.band,
    tier: progress.tier,
    asked: progress.asked,
    scored: progress.asked - progress.guaranteedAsked,
    peeked: true,
  };
}

export function awardPracticeCorrect(state, runStreak) {
  state.inventory.pearls += REWARDS.practicePearlPerCorrect;
  let star = false;
  if (runStreak > 0 && runStreak % REWARDS.practiceStarEvery === 0) {
    state.inventory.stars += 1;
    star = true;
  }
  return { pearls: REWARDS.practicePearlPerCorrect, star };
}

export function finishRun(state, { mode, moduleIds, ms, completed, skipRewards }) {
  state.sessions.push({
    at: new Date().toISOString(),
    mode,
    moduleIds,
    ms,
    completed: Boolean(completed),
  });
  const reward = { gems: 0, pearls: 0, sticker: null };
  if (!completed) return reward;
  const day = new Date().toISOString().slice(0, 10);
  if (!state.adventureDays.includes(day)) state.adventureDays.push(day);
  if (skipRewards) return reward;
  for (const id of moduleIds) {
    state.moduleCompletions[id] = (state.moduleCompletions[id] || 0) + 1;
  }
  if (mode === "assess") {
    state.inventory.gems += REWARDS.assessCompletionGems;
    reward.gems = REWARDS.assessCompletionGems;
    const stickerId = moduleIds.length > 1 ? "path" : moduleIds[0];
    reward.sticker = unlockSticker(state, stickerId);
  } else {
    state.inventory.pearls += REWARDS.practiceCompletionPearls;
    reward.pearls = REWARDS.practiceCompletionPearls;
    reward.sticker = unlockSticker(state, `practice-${moduleIds[0]}`);
  }
  return reward;
}

export const STICKERS = {
  path: { id: "path", name: "Path Crystal", emoji: "💎" },
  letters: { id: "letters", name: "Letter Lantern", emoji: "🏮" },
  pa: { id: "pa", name: "Spy Shell", emoji: "🐚" },
  cvc: { id: "cvc", name: "Word Pearl", emoji: "🫧" },
  sight: { id: "sight", name: "Star Shell", emoji: "⭐" },
  count: { id: "count", name: "Nest Gem", emoji: "🪺" },
  addsub: { id: "addsub", name: "Pair Fish", emoji: "🐟" },
  "practice-letters": { id: "practice-letters", name: "Lagoon Star", emoji: "🧡" },
  "practice-cvc": { id: "practice-cvc", name: "Current Star", emoji: "🌊" },
  "practice-pa": { id: "practice-pa", name: "Echo Star", emoji: "✨" },
  "practice-sight": { id: "practice-sight", name: "Trail Star", emoji: "🌟" },
  "practice-count": { id: "practice-count", name: "Counter Star", emoji: "🤍" },
  "practice-addsub": { id: "practice-addsub", name: "Story Star", emoji: "🐠" },
};

export function unlockSticker(state, id) {
  const sticker = STICKERS[id];
  if (!sticker) return null;
  if (state.inventory.stickers.includes(sticker.id)) return { ...sticker, fresh: false };
  state.inventory.stickers.push(sticker.id);
  return { ...sticker, fresh: true };
}

export function minutesLabel(ms) {
  if (!ms || ms < 60000) return "under a minute";
  const m = Math.round(ms / 60000);
  return m === 1 ? "1 minute" : `${m} minutes`;
}

export function totalPracticedLabel(state) {
  const ms = state.sessions.reduce((sum, s) => sum + (s.ms || 0), 0);
  return minutesLabel(ms);
}

export function baselineProgress(state) {
  const seen = new Set();
  for (const row of state?.checkHistory || []) {
    if (EXPLORER_AREAS.includes(row.moduleId)) seen.add(row.moduleId);
  }
  const completed = EXPLORER_AREAS.filter((id) => seen.has(id));
  const finished = completed.length === EXPLORER_AREAS.length;
  const parentOpened = Boolean(state?.settings?.lessonsUnlocked);
  return {
    completed,
    total: EXPLORER_AREAS.length,
    count: completed.length,
    remaining: EXPLORER_AREAS.filter((id) => !seen.has(id)),
    finished,
    lessonsOpen: finished || parentOpened,
  };
}

export function areaStatus(placement) {
  if (!placement || !placement.peeked || (placement.scored || 0) < 2) return "Not checked yet";
  if ((placement.level || 0) >= 3) return "Secure";
  if ((placement.level || 0) >= 2) return "Growing";
  return "Starting";
}

export function noteAreaCheck(state, moduleId) {
  if (!state.checkHistory) state.checkHistory = [];
  state.checkHistory.push({
    at: new Date().toISOString(),
    moduleId,
    status: areaStatus(state.placement[moduleId]),
  });
  if (state.checkHistory.length > 100) state.checkHistory.splice(0, state.checkHistory.length - 100);
}

export function awardAreaGem(state, moduleId) {
  noteAreaCheck(state, moduleId);
  state.moduleCompletions[moduleId] = (state.moduleCompletions[moduleId] || 0) + 1;
  state.inventory.gems += 1;
  return unlockSticker(state, moduleId);
}

export function assessmentReport(state) {
  const areas = EXPLORER_AREAS.filter((id) => MODULES[id]).map((id) => {
    const mod = MODULES[id];
    const placement = state.placement[id];
    return {
      id,
      title: mod.parentTitle,
      childTitle: mod.childTitle,
      standard: mod.standard || mod.parentTitle,
      status: areaStatus(placement),
      phrase: phraseFor(id, placement),
      game: mod.game || "Play the same idea with shells on the table for about 2 minutes.",
      cheer: mod.cheer || "Praise the trying.",
    };
  });
  const history = [...(state.checkHistory || [])].reverse();
  const lines = [
    "Everleigh's Rocky Top Reef — Explorer Check notes",
    "On this device only. Not a test score.",
    "",
    ...areas.map((area) => `${area.title}: ${area.status}. ${area.standard} ${area.phrase}. Praise: ${area.cheer} Game: ${area.game}`),
    "",
    "Checks over time:",
    ...(history.length ? history.map((row) => `${row.at.slice(0, 10)} ${MODULES[row.moduleId]?.parentTitle || row.moduleId}: ${row.status}`) : ["No finished checks yet."]),
  ];
  return { areas, history, text: lines.join("\n") };
}

export function phraseFor(moduleId, placement) {
  if (!placement || !placement.peeked) return "not peeked yet";
  if ((placement.scored || 0) < 2) return "early peek — still saying hello";
  return BAND_PHRASE[moduleId][placement.band] || "still getting acquainted";
}

function trendFor(events) {
  if (events.length < 4) return "just getting acquainted";
  const recent = events.slice(-8);
  const eases = recent.filter((e) => e.kind === "ease").length;
  const climbs = recent.filter((e) => e.kind === "bump" || e.kind === "skip" || e.kind === "harder").length;
  const half = Math.floor(recent.length / 2) || 1;
  const rate = (list) => list.filter((e) => e.correct).length / list.length;
  const first = rate(recent.slice(0, half));
  const second = rate(recent.slice(half));
  if (eases >= 2 && climbs === 0) return "needs support";
  if (second + 0.05 < first && second < 0.5) return "needs support";
  if (climbs > 0 || second >= first + 0.2) return "improving";
  return "steady";
}

const TREND_PLAIN = {
  "just getting acquainted": "just getting acquainted",
  "needs support": "needs a little side-by-side support",
  improving: "improving",
  steady: "steady",
};

export function parentInsights(state) {
  const sessionsCompleted = state.sessions.filter((s) => s.completed).length;
  const modules = {};
  for (const id of Object.keys(MODULES)) {
    const events = state.events.filter((e) => e.t === "item" && e.module === id);
    const placement = state.placement[id];
    modules[id] = {
      id,
      title: MODULES[id].parentTitle,
      childTitle: MODULES[id].childTitle,
      subject: MODULES[id].subject,
      completions: state.moduleCompletions[id] || 0,
      phrase: phraseFor(id, placement),
      trend: trendFor(events),
      trendPlain: TREND_PLAIN[trendFor(events)],
      peeked: Boolean(placement?.peeked),
    };
  }
  const recentItem = [...state.events].reverse().find((e) => e.t === "item");
  let workingOn = "Nothing is in motion yet. A Crystal Path check-in is a gentle start.";
  if (recentItem && MODULES[recentItem.module]) {
    const mod = MODULES[recentItem.module];
    workingOn = `Right now the reef is on ${mod.parentTitle.toLowerCase()} (${mod.childTitle}).`;
  }
  const support = Object.values(modules).filter((m) => m.trend === "needs support");
  const early = Object.values(modules).filter(
    (m) => m.peeked && state.placement[m.id]?.band === "seedling" && (state.placement[m.id]?.scored || 0) >= 2
  );
  let needsHelp = "No extra help spot yet. The first finished chunk will tell us more.";
  let helpModule = null;
  if (support.length) {
    helpModule = support[0];
    needsHelp = `A cozy help spot: ${helpModule.title.toLowerCase()}. ${HELP[helpModule.id]}`;
  } else if (early.length) {
    helpModule = early[0];
    needsHelp = `${helpModule.title} are still waking up. ${HELP[helpModule.id]}`;
  }
  const praise = praiseLines(state, modules);
  const teacherText = teacherCard(state, modules, workingOn, needsHelp, praise);
  return {
    sessionsCompleted,
    practicedLabel: totalPracticedLabel(state),
    adventureDays: state.adventureDays.length,
    modules,
    workingOn,
    needsHelp,
    praise,
    games: [
      {
        title: "Sound Scoop (about 2 minutes)",
        text: "Say three sounds with a little pause. She scoops them into a word. Try /s/ /u/ /n/ → sun. Cheer the stretch. Skip any word that sticks.",
      },
      {
        title: "Pearl Count (about 2 minutes)",
        text: "Put up to 10 spoons on the table. Ask how many. Let her move each one as she counts. If the trail slips, count together.",
      },
    ],
    teacherText,
    pearls: state.inventory.pearls,
    stars: state.inventory.stars,
    gems: state.inventory.gems,
  };
}

function praiseLines(state, modules) {
  const lines = ["Praise showing up and finishing a swim. Speed is not the prize."];
  const anyEase = state.events.some((e) => e.kind === "ease");
  const anyClimb = state.events.some((e) => e.kind === "skip" || e.kind === "bump");
  if (anyEase) lines.push('She stayed with a tricky bit. Say: “You used a hint and kept swimming.”');
  if (anyClimb) lines.push('She was ready for a deeper current. Say: “You stretched — I saw it.”');
  if (state.inventory.pearls > 0) {
    lines.push("In practice, pearls mark blends that clicked. Also praise the small bonus for finishing.");
  }
  const improving = Object.values(modules).filter((m) => m.trend === "improving");
  if (improving.length) {
    lines.push(`Notice ${improving[0].title.toLowerCase()} — that spot is improving.`);
  }
  if (lines.length === 1) lines.push('Say: “I liked how you listened.”');
  return lines;
}

function teacherCard(state, modules, workingOn, needsHelp, praise) {
  const peeked = Object.values(modules).filter((m) => m.peeked || m.completions > 0);
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!peeked.length && !state.sessions.length) {
    return [
      "Everleigh's Rocky Top Reef — home note for school",
      date,
      "",
      "Home note. This complements school evaluation. It does not replace it.",
      "Not a test score. No item-by-item results. No photos.",
      "",
      "No finished swim yet. This note fills in after she completes a check-in or a practice game.",
    ].join("\n");
  }
  const skills = peeked.map((m) => `${m.title} (${m.subject.toLowerCase()})`).join("; ");
  const strengths = [];
  const finished = state.sessions.filter((s) => s.completed).length;
  if (finished) strengths.push(`She finished ${finished} swim${finished === 1 ? "" : "s"}.`);
  for (const m of peeked) {
    if ((m.completions > 0 || (state.placement[m.id]?.scored || 0) >= 2) && m.phrase !== "not peeked yet") {
      strengths.push(`${m.title}: ${m.phrase}.`);
    }
  }
  if (!strengths.length) strengths.push("She has started saying hello to the reef.");
  const supportBits = peeked
    .filter((m) => m.trend === "needs support" || (state.placement[m.id]?.band === "seedling" && (state.placement[m.id]?.scored || 0) >= 2))
    .map((m) => `${m.title}: ${HELP[m.id]}`);
  if (!supportBits.length) supportBits.push("Short games, hints welcome, no timing. Side-by-side is enough.");
  return [
    "Everleigh's Rocky Top Reef — home note for school",
    date,
    "",
    "Home note. This complements school evaluation. It does not replace it.",
    "Not a test score. No item-by-item results. No photos.",
    "",
    `Skills practiced: ${skills}`,
    `Adventure chunks and practice games finished: ${finished}`,
    `Time on this device: ${totalPracticedLabel(state)} across ${state.adventureDays.length} adventure day${state.adventureDays.length === 1 ? "" : "s"}.`,
    "",
    "Strengths:",
    ...strengths.map((s) => `- ${s}`),
    "",
    "Support that helps:",
    ...supportBits.map((s) => `- ${s}`),
    "",
    `Now: ${workingOn}`,
    `Help spot: ${needsHelp}`,
    "",
    `A praise line that lands: ${praise[0]}`,
  ].join("\n");
}

export function assessFinishCopy(title) {
  return `You finished ${title}. A gem for completing the adventure. Sunny did not keep a score.`;
}

export function practiceFinishCopy(pearlsFromClicks) {
  const bonus = REWARDS.practiceCompletionPearls;
  if (pearlsFromClicks > 0) {
    return `Blends that clicked brought ${pearlsFromClicks} pearls. Finishing adds ${bonus} more — a smaller bonus. The clicks are the big treasure.`;
  }
  return `You stayed to the end. A small finishing bonus of ${bonus} pearls is yours. The big pearls show up when a blend clicks.`;
}

export function restCopy(mode, pearlsFromClicks) {
  if (mode === "assess") {
    return "Resting is a strong choice. The gem waits until this adventure chunk is finished. Nothing unkind is saved.";
  }
  if (pearlsFromClicks > 0) {
    return `You keep the ${pearlsFromClicks} pearls you already earned. The small finishing bonus waits for the end of the game.`;
  }
  return "Resting is a strong choice. Pearls you earn for a click stay with you. The finishing bonus waits for the end.";
}

function skillIdOr(id) {
  return MODULES[id]?.skillId || id;
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length) % list.length];
}

function chooseKey(rng, pool, avoid, lastKey) {
  const fresh = pool.filter((k) => !avoid.has(k) && k !== lastKey);
  const bag = fresh.length ? fresh : pool.filter((k) => k !== lastKey);
  return pick(rng, bag.length ? bag : pool);
}

function shuffle(rng, list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nonce(rng) {
  return Math.floor(rng() * 1e9).toString(36);
}

const SOUNDS = {
  a: { label: "aaa", emoji: "🍎", speak: "aaa, like apple", word: "apple", hum: "aaa" },
  e: { label: "eh", emoji: "🥚", speak: "eh, like egg", word: "egg", hum: "eh" },
  i: { label: "iii", emoji: "iguana", speak: "iii, like igloo", word: "igloo", hum: "iii", emojiReal: "🧊" },
  o: { label: "ooo", emoji: "🐙", speak: "ooo, like octopus", word: "octopus", hum: "ooo" },
  u: { label: "uh", emoji: "☂️", speak: "uh, like umbrella", word: "umbrella", hum: "uh" },
  m: { label: "mmm", emoji: "🌙", speak: "mmm, like moon", word: "moon", hum: "mmm" },
  s: { label: "sss", emoji: "☀️", speak: "sss, like sun", word: "sun", hum: "sss" },
  t: { label: "ttt", emoji: "🐢", speak: "ttt, like turtle", word: "turtle", hum: "ttt" },
  p: { label: "p", emoji: "🐷", speak: "p, like pig", word: "pig", hum: "p" },
  n: { label: "nnn", emoji: "🪺", speak: "nnn, like nest", word: "nest", hum: "nnn" },
  b: { label: "b", emoji: "🐻", speak: "b, like bear", word: "bear", hum: "b" },
  d: { label: "d", emoji: "🐶", speak: "d, like dog", word: "dog", hum: "d" },
  c: { label: "k", emoji: "🐱", speak: "k, like cat", word: "cat", hum: "k" },
  f: { label: "fff", emoji: "🐟", speak: "fff, like fish", word: "fish", hum: "fff" },
  g: { label: "g", emoji: "🍇", speak: "g, like grape", word: "grape", hum: "g" },
  h: { label: "h", emoji: "🎩", speak: "h, like hat", word: "hat", hum: "h" },
  q: { label: "kw", emoji: "👸", speak: "kw, like queen", word: "queen", hum: "kw" },
  v: { label: "vvv", emoji: "🚐", speak: "vvv, like van", word: "van", hum: "vvv" },
  w: { label: "w", emoji: "🌊", speak: "w, like wave", word: "wave", hum: "w" },
  j: { label: "j", emoji: "🫙", speak: "j, like jam", word: "jam", hum: "j" },
  z: { label: "zzz", emoji: "💤", speak: "zzz, like zip", word: "zip", hum: "zzz" },
  k: { label: "k", emoji: "🪁", speak: "k, like kite", word: "kite", hum: "k" },
  y: { label: "y", emoji: "🧶", speak: "y, like yarn", word: "yarn", hum: "y" },
  l: { label: "lll", emoji: "🍋", speak: "lll, like lemon", word: "lemon", hum: "lll" },
  r: { label: "rrr", emoji: "🌈", speak: "rrr, like rain", word: "rain", hum: "rrr" },
};

SOUNDS.i.emoji = "🧊";

const CONFUSABLE = {
  b: ["d", "p"],
  d: ["b", "p"],
  p: ["b", "q"],
  q: ["p", "d"],
  m: ["n", "s"],
  n: ["m", "t"],
  i: ["e", "a"],
  e: ["i", "a"],
  c: ["k", "s"],
  k: ["c", "g"],
  f: ["v", "s"],
  v: ["f", "w"],
  g: ["d", "j"],
};

const LETTER_POOL = {
  0: ["m", "s", "t", "a"],
  1: ["m", "s", "t", "a", "p", "n", "i", "o"],
  2: ["c", "d", "f", "h", "g", "u", "e", "b", "n", "p"],
  3: ["b", "d", "p", "q", "v", "w", "j", "z"],
};
const LETTER_CEILING = {
  0: ["a", "t"],
  1: ["i", "o", "n", "p"],
  2: ["b", "d", "e", "u"],
  3: ["b", "d", "p", "q"],
};

function line(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function choiceCount(rng, ctx) {
  if (ctx.guaranteed) return rng() > 0.65 ? 2 : 3;
  if (ctx.support === "high") return rng() > 0.5 ? 2 : 3;
  const roll = rng();
  if (roll < 0.22) return 2;
  if (roll < 0.68) return 3;
  return 4;
}

function letterItem(rng, ctx) {
  const pool = ctx.tier === "ceiling" ? LETTER_CEILING[ctx.level] : LETTER_POOL[ctx.level];
  const letter = chooseKey(rng, pool, ctx.avoid, ctx.lastKey);
  const sound = SOUNDS[letter];
  const upper = ctx.level === 0 ? rng() > 0.25 : rng() > 0.5;
  const glyph = upper ? letter.toUpperCase() : letter;
  const nChoices = choiceCount(rng, ctx);
  const confusable = (CONFUSABLE[letter] || []).filter((d) => d !== letter && SOUNDS[d]);
  const distant = ["m", "s", "t", "p", "a", "o", "f", "n", "h"].filter((d) => d !== letter && SOUNDS[d]);
  const style = Math.floor(rng() * 3);
  const bag = style === 0 ? [...confusable, ...distant] : style === 1 ? [...distant, ...confusable] : shuffle(rng, [...confusable, ...distant]);
  const chosen = [letter];
  for (const d of shuffle(rng, bag)) {
    if (chosen.length >= nChoices) break;
    if (!chosen.includes(d)) chosen.push(d);
  }
  const choices = shuffle(rng, chosen).map((id) => ({
    id,
    label: SOUNDS[id].label,
    emoji: SOUNDS[id].emoji,
    speak: SOUNDS[id].speak,
  }));
  const name = glyph;
  const hint = ctx.showHint
    ? line(rng, [
        `${name} hums ${sound.hum}, like ${sound.word}.`,
        `Think of ${sound.word}. The sound is ${sound.hum}.`,
        `Hold ${sound.hum}, the way ${sound.word} starts.`,
        `${sound.word} begins with this friend.`,
      ])
    : line(rng, [
        "Hum the sound quietly, then tap its shell.",
        "Try the sound in your mouth before you tap.",
        "Listen for the hum, not the letter’s name.",
        "Stretch the sound, then find the shell that matches.",
      ]);
  const prompt = line(rng, [
    "Which sound does this letter make?",
    "Tap the sound this letter makes.",
    "Find the shell with this letter’s sound.",
  ]);
  return {
    id: `letters-${letter}-${nonce(rng)}`,
    key: `L${letter}`,
    kind: "letter",
    display: glyph,
    prompt,
    speak: prompt,
    lead: ctx.guaranteed ? "A friendly letter to start." : "Find this letter’s sound.",
    answer: letter,
    choices,
    hint,
    worked: `${name} hums ${sound.hum}, like ${sound.word}.`,
    audio_key: `letter-${letter}`,
  };
}

const SPY_WORDS = [
  { word: "moon", emoji: "🌙", first: "m", last: "n", lv: 0 },
  { word: "sun", emoji: "☀️", first: "s", last: "n", lv: 0 },
  { word: "turtle", emoji: "🐢", first: "t", last: "l", lv: 0 },
  { word: "fish", emoji: "🐟", first: "f", last: "sh", lv: 1 },
  { word: "pig", emoji: "🐷", first: "p", last: "g", lv: 1 },
  { word: "map", emoji: "🗺️", first: "m", last: "p", lv: 1 },
  { word: "net", emoji: "🥅", first: "n", last: "t", lv: 1 },
  { word: "dog", emoji: "🐶", first: "d", last: "g", lv: 2 },
  { word: "cup", emoji: "🥤", first: "c", last: "p", lv: 2 },
  { word: "web", emoji: "🕸️", first: "w", last: "b", lv: 2 },
  { word: "jam", emoji: "🫙", first: "j", last: "m", lv: 3 },
  { word: "bug", emoji: "🐛", first: "b", last: "g", lv: 3 },
  { word: "hat", emoji: "🎩", first: "h", last: "t", lv: 2 },
  { word: "van", emoji: "🚐", first: "v", last: "n", lv: 3 },
];

function spyItem(rng, ctx) {
  let mode = ctx.forceMode || "first";
  if (!ctx.forceMode) {
    if (ctx.level >= 3 && ctx.tier === "ceiling" && rng() > 0.35) mode = "picture";
    else if (ctx.level >= 2 && rng() > 0.4) mode = "last";
    else if (ctx.level >= 1 && rng() > 0.78) mode = "last";
  }
  const pool = SPY_WORDS.filter((w) => (mode === "picture" ? w.lv <= 3 : w.lv <= ctx.level + 1));
  const word = chooseKey(
    rng,
    pool.map((w) => w.word),
    ctx.avoid,
    ctx.lastKey
  );
  const target = SPY_WORDS.find((w) => w.word === word);
  if (mode === "picture") {
    const others = shuffle(
      rng,
      SPY_WORDS.filter((w) => w.word !== target.word)
    ).slice(0, choiceCount(rng, ctx) - 1);
    const choices = shuffle(rng, [target, ...others]).map((w) => ({
      id: w.word,
      label: w.word,
      emoji: w.emoji,
      speak: w.word,
    }));
    return {
      id: `spy-${word}-${nonce(rng)}`,
      key: word,
      kind: "spy-picture",
      emoji: "👂",
      parts: target.word.split(""),
      prompt: "Which picture matches these sounds?",
      speak: `Which picture matches ${target.word.split("").join(", ")}?`,
      lead: "Listen to the sounds, then tap the picture.",
      answer: target.word,
      choices,
      hint: ctx.showHint
        ? line(rng, [
            `The sounds blend toward ${target.word}.`,
            `Those sounds belong with ${target.word}.`,
            `Picture ${target.word} as you blend.`,
          ])
        : line(rng, [
            "Listen for the first sound, then the rest.",
            "Blend the sounds in order, then tap the picture.",
            "Catch the opening sound and see which picture fits.",
          ]),
      worked: `Those sounds match ${target.word}.`,
      audio_key: `spy-${word}`,
    };
  }
  const focus = mode === "last" ? target.last : target.first;
  const n = choiceCount(rng, ctx);
  const poolSounds = ["m", "s", "t", "p", "n", "d", "f", "b", "l", "g", "sh"];
  const distract = shuffle(
    rng,
    poolSounds.filter((s) => s !== focus)
  ).slice(0, n - 1);
  const choices = shuffle(rng, [focus, ...distract]).map((id) => ({
    id,
    label: SOUNDS[id]?.label || id,
    emoji: SOUNDS[id]?.emoji || "🐚",
    speak: SOUNDS[id]?.speak || id,
  }));
  const where = mode === "last" ? "last" : "first";
  return {
    id: `spy-${where}-${word}-${nonce(rng)}`,
    key: `${where}-${word}`,
    kind: mode === "last" ? "spy-last" : "spy-first",
    emoji: target.emoji,
    prompt: `Tap the ${where} sound in this word.`,
    speak: `${target.word}. What is the ${where} sound?`,
    lead: ctx.guaranteed ? "A friendly sound to start." : `Sunny whispers “${target.word}.”`,
    answer: focus,
    choices,
    hint: ctx.showHint
      ? line(rng, [
          `${target.word} — the ${where} sound is ${SOUNDS[focus]?.hum || focus}.`,
          `Stretch ${target.word}. Listen at the ${where}.`,
          `The ${where} sound in ${target.word} is ${SOUNDS[focus]?.hum || focus}.`,
        ])
      : line(rng, [
          `Say ${target.word} slowly and listen for the ${where} sound.`,
          `Whisper ${target.word} and catch the ${where} sound.`,
          `Tap the sound you hear at the ${where} of ${target.word}.`,
        ]),
    worked: `${target.word}. The ${where} sound is ${SOUNDS[focus]?.hum || focus}.`,
    audio_key: `spy-${word}`,
    display: target.word,
  };
}

const REAL_WORDS = [
  { w: "mat", e: "🧶", lv: 0 },
  { w: "sat", e: "🪑", lv: 0 },
  { w: "sit", e: "🧘", lv: 0 },
  { w: "sun", e: "☀️", lv: 0 },
  { w: "man", e: "🙂", lv: 0 },
  { w: "tin", e: "🥫", lv: 0 },
  { w: "map", e: "🗺️", lv: 1 },
  { w: "nap", e: "😴", lv: 1 },
  { w: "hat", e: "🎩", lv: 1 },
  { w: "pig", e: "🐷", lv: 1 },
  { w: "cup", e: "🥤", lv: 1 },
  { w: "bed", e: "🛏️", lv: 1 },
  { w: "cat", e: "🐱", lv: 1 },
  { w: "hot", e: "🔥", lv: 1 },
  { w: "dog", e: "🐶", lv: 2 },
  { w: "bug", e: "🐛", lv: 2 },
  { w: "web", e: "🕸️", lv: 2 },
  { w: "fan", e: "💨", lv: 2 },
  { w: "pot", e: "🍲", lv: 2 },
  { w: "fin", e: "🐟", lv: 2 },
  { w: "bus", e: "🚌", lv: 2 },
  { w: "mud", e: "🌧️", lv: 2 },
  { w: "log", e: "🪵", lv: 2 },
  { w: "pen", e: "🖊️", lv: 2 },
  { w: "dig", e: "🪴", lv: 2 },
  { w: "gum", e: "🫧", lv: 2 },
  { w: "wig", e: "💇", lv: 3 },
  { w: "vet", e: "🩺", lv: 3 },
  { w: "cob", e: "🌽", lv: 3 },
  { w: "hum", e: "🎵", lv: 3 },
  { w: "zip", e: "🤐", lv: 3 },
];

const BLOCK = new Set(["cum", "tit", "fag", "gay", "die", "sex", "ass", "fuk", "dik", "sux", "dam", "poo", "pee", "hell"]);
const ONSETS = ["m", "s", "t", "p", "n", "b", "d", "c", "f", "h", "g", "v", "w", "j", "l", "r", "k", "z"];
const VOWELS = ["a", "e", "i", "o", "u"];
const CODAS = ["t", "p", "n", "d", "g", "b", "m"];

function partsOf(word) {
  return word.split("");
}

function cvcItem(rng, ctx) {
  const ceiling = ctx.tier === "ceiling" || ctx.level === 3;
  const allowPassword = ctx.level >= 3 || (ctx.level === 2 && ceiling && rng() > 0.55);
  let entry = null;
  let password = false;
  if (!allowPassword || rng() > 0.45) {
    const pool = REAL_WORDS.filter((w) => w.lv <= ctx.level && (ceiling ? w.lv >= Math.max(0, ctx.level - 1) : true));
    const keys = pool.map((w) => w.w);
    if (keys.length) {
      const w = chooseKey(rng, keys, ctx.avoid, ctx.lastKey);
      entry = REAL_WORDS.find((item) => item.w === w);
    }
  }
  if (!entry) {
    password = true;
    let word = "mip";
    for (let i = 0; i < 8; i += 1) {
      const candidate = pick(rng, ONSETS) + pick(rng, VOWELS) + pick(rng, CODAS);
      if (!BLOCK.has(candidate)) {
        word = candidate;
        if (!ctx.avoid.has(word)) break;
      }
    }
    entry = { w: word, e: "🐚", lv: 3 };
  }
  const n = choiceCount(rng, ctx);
  const distractors = [];
  const chars = entry.w.split("");
  const slotPlan = line(rng, ["onset", "vowel", "coda", "mixed"]);
  const slotFor = (index) => {
    if (slotPlan === "onset") return 0;
    if (slotPlan === "vowel") return 1;
    if (slotPlan === "coda") return Math.max(0, chars.length - 1);
    return index % chars.length;
  };
  let spins = 0;
  while (distractors.length < n - 1 && spins < 12) {
    spins += 1;
    const copy = [...chars];
    const slot = slotFor(distractors.length + spins);
    const bag = slot === 1 ? VOWELS : slot === 0 ? ONSETS : CODAS;
    copy[slot] = pick(rng, bag);
    const alt = copy.join("");
    if (alt !== entry.w && !BLOCK.has(alt) && !distractors.includes(alt)) distractors.push(alt);
  }
  const fallbacks = shuffle(rng, ["sun", "mat", "pig", "cup", "web", "hat"]).filter((w) => w !== entry.w);
  while (distractors.length < n - 1) distractors.push(fallbacks[distractors.length % fallbacks.length]);
  const choiceWords = shuffle(rng, [entry.w, ...distractors.slice(0, n - 1)]);
  const choices = choiceWords.map((w) => {
    const known = REAL_WORDS.find((item) => item.w === w);
    return {
      id: w,
      label: w,
      emoji: password ? "🐚" : known?.e || "🐚",
      speak: w,
    };
  });
  const parts = partsOf(entry.w);
  const hint = ctx.showHint
    ? line(rng, [
        `${parts.join(" · ")} blends to ${entry.w}.`,
        `Slide ${parts.join(" ")} together. You get ${entry.w}.`,
        `Start with ${parts[0]}, then the rest. ${entry.w}.`,
      ])
    : line(rng, [
        "Say the first sound, the middle, then the last.",
        "Stretch each sound, then scoop them together.",
        "Tap the chips one at a time, then blend.",
        "Listen for the vowel in the middle before you tap.",
      ]);
  return {
    id: `cvc-${entry.w}-${nonce(rng)}`,
    key: entry.w,
    kind: "blend",
    parts,
    prompt: password ? "Secret reef password. Blend the sounds." : "Blend the sounds. Which word is it?",
    speak: password
      ? `Secret reef password. ${parts.join(", ")}.`
      : `Blend the sounds. ${parts.join(", ")}.`,
    lead: ctx.guaranteed ? "A friendly word to start." : password ? "A made-up reef password." : "Stretch the sounds.",
    answer: entry.w,
    choices,
    hint,
    worked: `${parts.join(" ")} blends to ${entry.w}.`,
    audio_key: `word-${entry.w}`,
    emoji: entry.e,
  };
}

const SIGHT = {
  0: [
    { w: "a", alts: ["I", "is"] },
    { w: "I", alts: ["a", "is"] },
    { w: "go", alts: ["so", "to"] },
    { w: "see", alts: ["we", "me"] },
  ],
  1: [
    { w: "the", alts: ["to", "and"] },
    { w: "to", alts: ["the", "you"] },
    { w: "you", alts: ["your", "yes"] },
    { w: "is", alts: ["it", "in"] },
    { w: "and", alts: ["a", "the"] },
    { w: "my", alts: ["me", "by"] },
  ],
  2: [
    { w: "was", alts: ["saw", "as"] },
    { w: "said", alts: ["and", "sand"] },
    { w: "are", alts: ["our", "art"] },
    { w: "they", alts: ["the", "then"] },
  ],
  3: [
    { w: "were", alts: ["where", "here"] },
    { w: "what", alts: ["that", "want"] },
    { w: "your", alts: ["you", "our"] },
    { w: "want", alts: ["what", "went"] },
  ],
};

function sightItem(rng, ctx) {
  const level = ctx.tier === "ceiling" ? Math.min(3, ctx.level + (ctx.level < 3 && rng() > 0.5 ? 1 : 0)) : ctx.level;
  const pool = SIGHT[clamp(level, 0, 3)];
  const keys = pool.map((item) => item.w);
  const w = chooseKey(rng, keys, ctx.avoid, ctx.lastKey);
  const row = pool.find((item) => item.w === w);
  const n = Math.min(row.alts.length, choiceCount(rng, ctx) - 1);
  const alts = shuffle(rng, row.alts).slice(0, Math.max(1, n));
  const choices = shuffle(rng, [row.w, ...alts]).map((id) => ({
    id,
    label: id,
    emoji: line(rng, ["✨", "🐚", "⭐"]),
    speak: id,
  }));
  const prompt = line(rng, [
    "Tap the same word. No rush.",
    "Find the twin of this word.",
    "Which shell shows the same word?",
  ]);
  return {
    id: `sight-${row.w}-${nonce(rng)}`,
    key: `sight-${row.w}`,
    kind: "sight",
    display: row.w,
    prompt,
    speak: `${prompt} ${row.w}.`,
    lead: "A friendly word to wave at.",
    answer: row.w,
    choices,
    hint: ctx.showHint
      ? line(rng, [`This word says ${row.w}.`, `Look for ${row.w} again.`, `${row.w} has a twin on a shell.`])
      : line(rng, [
          "Look at the shape of the word, then tap its twin.",
          "Read it once, then find the match.",
          "No timer. Match the word you see.",
        ]),
    worked: `The word is ${row.w}.`,
    audio_key: `sight-${row.w}`,
  };
}

function countItem(rng, ctx) {
  const ranges = [
    [1, 3],
    [3, 5],
    [6, 8],
    [8, 10],
  ];
  const [lo, hi] = ranges[ctx.level];
  if (ctx.level >= 2 && ctx.tier === "ceiling" && rng() > 0.4) {
    let a = lo + Math.floor(rng() * (hi - lo + 1));
    let b = lo + Math.floor(rng() * (hi - lo + 1));
    if (a === b) b = clamp(a + 1, 1, 10);
    const answer = a === b ? "same" : a > b ? "left" : "right";
    return {
      id: `cmp-${a}-${b}-${nonce(rng)}`,
      key: `cmp-${a}-${b}`,
      kind: "compare",
      dots: a,
      dotsB: b,
      prompt: "Which nest has more pearls?",
      speak: "Which nest has more pearls?",
      lead: "Look at both nests.",
      answer,
      choices: (() => {
        const all = [
          { id: "left", label: "Left nest", emoji: "🐚", speak: "left nest" },
          { id: "right", label: "Right nest", emoji: "🫧", speak: "right nest" },
          { id: "same", label: "Same", emoji: "🤍", speak: "the same" },
        ];
        const n = choiceCount(rng, ctx);
        const rest = shuffle(rng, all.filter((c) => c.id !== answer)).slice(0, n - 1);
        return shuffle(rng, [all.find((c) => c.id === answer), ...rest]);
      })(),
      hint: ctx.showHint
        ? line(rng, ["Count each nest, one pearl at a time.", "Touch every pearl in the left nest, then the right."])
        : line(rng, ["Count the left nest, then the right.", "Which pile is taller when you count?", "One touch for each pearl."]),
      worked: answer === "same" ? "The nests match." : `The ${answer} nest has more.`,
      audio_key: `compare-${a}-${b}`,
    };
  }
  const n = lo + Math.floor(rng() * (hi - lo + 1));
  const offsets = shuffle(rng, [-2, -1, 1, 2]).map((d) => clamp(n + d, 1, 10)).filter((d) => d !== n);
  const nChoices = choiceCount(rng, ctx);
  const nums = [n, ...offsets].slice(0, nChoices);
  while (nums.length < nChoices) nums.push(clamp(n + nums.length, 1, 10));
  return {
    id: `count-${n}-${nonce(rng)}`,
    key: `count-${n}-${ctx.level}`,
    kind: "count",
    dots: n,
    prompt: line(rng, ["How many pearls do you see?", "Count the pearls, then tap the number.", "Tap how many pearls are here."]),
    speak: "How many pearls do you see?",
    lead: ctx.guaranteed ? "A little pile to start." : line(rng, ["Touch each pearl as you count.", "One touch, one number."]),
    answer: String(n),
    choices: shuffle(rng, nums).map((num) => ({
      id: String(num),
      label: String(num),
      emoji: "🐚",
      speak: String(num),
    })),
    hint: ctx.showHint
      ? line(rng, [`There are ${n} pearls.`, `Count them slowly. ${n}.`])
      : line(rng, ["Touch each pearl once as you count.", "Say the numbers as you touch.", "Don’t skip a pearl."]),
    worked: `There are ${n} pearls.`,
    audio_key: `count-${n}`,
  };
}

function storyItem(rng, ctx) {
  const take = ctx.level >= 2 && (ctx.tier === "ceiling" || rng() > 0.5);
  let a;
  let b;
  if (ctx.level === 0) {
    a = 1 + Math.floor(rng() * 3);
    b = 1 + Math.floor(rng() * Math.max(1, 5 - a));
  } else if (ctx.level === 1) {
    a = 2 + Math.floor(rng() * 5);
    b = 1 + Math.floor(rng() * Math.max(1, 10 - a));
  } else if (!take) {
    a = 3 + Math.floor(rng() * 6);
    b = 1 + Math.floor(rng() * 4);
  } else {
    a = 4 + Math.floor(rng() * (ctx.level === 3 ? 8 : 6));
    b = 1 + Math.floor(rng() * Math.min(4, a - 1));
  }
  const total = take ? a - b : a + b;
  const story = take
    ? `${a} fish swim. ${b} swim away. How many fish stay?`
    : `${a} fish swim. ${b} more join. How many fish now?`;
  const n = choiceCount(rng, ctx);
  const alts = shuffle(rng, [total + 1, total - 1, total + 2, a, b, total + 3]).filter((x) => x !== total && x >= 0);
  const nums = [total, ...alts].slice(0, n);
  return {
    id: `story-${a}-${b}-${take ? "t" : "j"}-${nonce(rng)}`,
    key: `story-${a}-${b}-${take ? "t" : "j"}`,
    kind: "story",
    story,
    dots: a,
    dotsB: b,
    prompt: story,
    speak: story,
    lead: "Use the fish if you want.",
    answer: String(total),
    choices: shuffle(rng, nums).map((num) => ({
      id: String(num),
      label: String(num),
      emoji: "🐟",
      speak: String(num),
    })),
    hint: ctx.showHint
      ? take
        ? line(rng, [`Start at ${a} and hop back ${b}. ${total} stay.`, `Take ${b} away from ${a}. ${total} are left.`])
        : line(rng, [`Start at ${a} and count on ${b}. That makes ${total}.`, `${a} together with ${b} is ${total}.`])
      : take
        ? line(rng, ["Start with the first group and hop backward.", "Cover the fish that swam away, then count."])
        : line(rng, ["Start with the first group and count on.", "Keep the first fish and count the new ones."]),
    worked: take ? `${a} take away ${b} leaves ${total}.` : `${a} and ${b} makes ${total}.`,
    audio_key: `story-${total}`,
  };
}

const RHYME_SETS = [
  { w: "cat", e: "🐱", yes: "hat", no: ["sun", "cup"] },
  { w: "bug", e: "🐛", yes: "rug", no: ["map", "pen"] },
  { w: "hop", e: "🐰", yes: "top", no: ["sun", "web"] },
  { w: "fin", e: "🐟", yes: "pin", no: ["cat", "mud"] },
  { w: "cake", e: "🍰", yes: "lake", no: ["bug", "sun"] },
  { w: "tree", e: "🌳", yes: "bee", no: ["cup", "map"] },
  { w: "light", e: "💡", yes: "kite", no: ["dog", "web"] },
  { w: "star", e: "⭐", yes: "car", no: ["pig", "cup"] },
];

function rhymeItem(rng, ctx) {
  const pool = RHYME_SETS.filter((row) => (ctx.level < 2 ? row.w.length <= 3 : true));
  const row = pool[Math.floor(rng() * pool.length)] || RHYME_SETS[0];
  const n = choiceCount(rng, ctx);
  const distract = shuffle(rng, row.no).slice(0, n - 1);
  const choices = shuffle(rng, [row.yes, ...distract]).map((id) => ({
    id, label: id, emoji: "🐚", speak: id,
  }));
  return {
    id: `rhyme-${row.w}-${nonce(rng)}`,
    key: `rhyme-${row.w}`,
    kind: "sight",
    display: row.w,
    emoji: row.e,
    prompt: `Which word rhymes with ${row.w}?`,
    speak: `Which word rhymes with ${row.w}?`,
    lead: "Listen for the ending sound.",
    answer: row.yes,
    choices,
    hint: ctx.showHint ? `${row.w} and ${row.yes} end the same.` : "Say the word, then listen to the end.",
    worked: `${row.w} rhymes with ${row.yes}.`,
    audio_key: `rhyme-${row.w}`,
  };
}

function firstItem(rng, ctx) {
  return spyItem(rng, { ...ctx, forceMode: "first" });
}

function blendItem(rng, ctx) {
  return cvcItem(rng, ctx);
}

function segmentItem(rng, ctx) {
  const words = [
    { w: "at", n: 2 }, { w: "sun", n: 3 }, { w: "mat", n: 3 }, { w: "stop", n: 4 }, { w: "cat", n: 3 }, { w: "it", n: 2 }, { w: "fish", n: 3 }, { w: "sand", n: 4 },
  ].filter((row) => (ctx.level < 2 ? row.n <= 3 : true));
  const row = words[Math.floor(rng() * words.length)];
  const opts = shuffle(rng, [row.n, row.n + 1, Math.max(1, row.n - 1)]).slice(0, choiceCount(rng, ctx));
  if (!opts.includes(row.n)) opts[0] = row.n;
  return {
    id: `seg-${row.w}-${nonce(rng)}`,
    key: `seg-${row.w}`,
    kind: "count",
    dots: row.n,
    prompt: `How many sounds are in ${row.w}?`,
    speak: `How many sounds are in ${row.w}?`,
    lead: "Stretch the word and count the sounds.",
    answer: String(row.n),
    choices: shuffle(rng, opts).map((num) => ({ id: String(num), label: String(num), emoji: "🐚", speak: String(num) })),
    hint: ctx.showHint ? `${row.w} has ${row.n} sounds.` : "Tap one shell for each sound you hear.",
    worked: `${row.w} has ${row.n} sounds.`,
    audio_key: `seg-${row.w}`,
  };
}

function compareItem(rng, ctx) {
  const cap = ctx.level >= 3 ? 20 : ctx.level === 2 ? 12 : 8;
  let a = 1 + Math.floor(rng() * cap);
  let b = 1 + Math.floor(rng() * cap);
  if (a === b) b = Math.min(cap, a + 1);
  const answer = a > b ? "left" : "right";
  return {
    id: `cmp2-${a}-${b}-${nonce(rng)}`,
    key: `cmp2-${a}-${b}`,
    kind: "compare",
    dots: a,
    dotsB: b,
    prompt: "Which nest has more pearls?",
    speak: "Which nest has more pearls?",
    lead: "Count both nests.",
    answer,
    choices: shuffle(rng, [
      { id: "left", label: "Left nest", emoji: "🐚", speak: "left nest" },
      { id: "right", label: "Right nest", emoji: "🫧", speak: "right nest" },
    ]),
    hint: ctx.showHint ? "Count each nest, one pearl at a time." : "Touch every pearl before you choose.",
    worked: `The ${answer} nest has more.`,
    audio_key: `compare-${a}-${b}`,
  };
}

function withinItem(rng, ctx, maxSum) {
  const take = rng() > 0.5;
  const span = ctx.level < 2 ? Math.min(10, maxSum) : maxSum;
  let a = 1 + Math.floor(rng() * Math.max(2, span - 1));
  let b = 1 + Math.floor(rng() * Math.max(1, (take ? a : span - a)));
  if (!take && a + b > span) b = Math.max(1, span - a);
  if (take && b >= a) b = Math.max(1, a - 1);
  const total = take ? a - b : a + b;
  const story = take
    ? `${a} fish swim. ${b} swim away. How many stay?`
    : `${a} fish swim. ${b} more join. How many now?`;
  const alts = shuffle(rng, [total + 1, Math.max(0, total - 1), a, b]).filter((n) => n !== total);
  const nums = [total, ...alts].slice(0, choiceCount(rng, ctx));
  return {
    id: `ops-${maxSum}-${a}-${b}-${nonce(rng)}`,
    key: `ops-${maxSum}-${a}-${b}-${take ? "t" : "j"}`,
    kind: "story",
    story,
    dots: a,
    dotsB: b,
    prompt: story,
    speak: story,
    lead: "Use the fish if you want.",
    answer: String(total),
    choices: shuffle(rng, nums).map((num) => ({ id: String(num), label: String(num), emoji: "🐟", speak: String(num) })),
    hint: ctx.showHint
      ? (take ? `Start at ${a} and hop back ${b}.` : `Start at ${a} and count on ${b}.`)
      : "Count the fish. A hint is a kindness.",
    worked: take ? `${a} take away ${b} leaves ${total}.` : `${a} and ${b} makes ${total}.`,
    audio_key: `story-${total}`,
  };
}

const BUILDERS = {
  letters: letterItem,
  pa: spyItem,
  rhyme: rhymeItem,
  first: firstItem,
  blend: blendItem,
  segment: segmentItem,
  cvc: cvcItem,
  sight: sightItem,
  count: countItem,
  compare: compareItem,
  add10: (rng, ctx) => withinItem(rng, ctx, 10),
  add20: (rng, ctx) => withinItem(rng, ctx, 20),
  addsub: storyItem,
};

export function cheerLine(seed) {
  return CHEERS[Math.abs(seed) % CHEERS.length];
}
