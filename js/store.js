import { emptyState } from "./engine.js";

const KEY = "rocky-top-reef-v1";

export function adoptState(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Backup was not a reef file.");
  }
  const base = emptyState();
  return {
    ...base,
    ...parsed,
    v: 1,
    settings: {
      ...base.settings,
      ...(parsed.settings || {}),
      nickname: "",
    },
    inventory: { ...base.inventory, ...(parsed.inventory || {}) },
    placement: parsed.placement && typeof parsed.placement === "object" ? parsed.placement : {},
    events: Array.isArray(parsed.events) ? parsed.events : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    packIndex: parsed.packIndex && typeof parsed.packIndex === "object" ? parsed.packIndex : {},
    moduleCompletions: parsed.moduleCompletions && typeof parsed.moduleCompletions === "object" ? parsed.moduleCompletions : {},
    adventureDays: Array.isArray(parsed.adventureDays) ? parsed.adventureDays : [],
  };
}

export function encodeBackup(state) {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeBackup(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Empty backup.");
  if (raw.startsWith("{")) return JSON.parse(raw);
  const b64 = raw.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    return adoptState(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode */
  }
}
