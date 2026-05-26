"use client";

/**
 * Local-only journal persistence. No network. Uses localStorage.
 * Designed to be easy to swap with a server later.
 */

export type JournalEntry = {
  id: string;
  createdAt: number;       // ms
  updatedAt: number;       // ms
  prompt?: string;          // optional emotional prompt seed
  body: string;             // the writing
  moods: string[];          // selected mood tags
  favorite?: boolean;
};

export type JournalDraft = {
  body: string;
  prompt?: string;
  moods: string[];
  updatedAt: number;
};

const KEY_ENTRIES = "tozumlo.journal.entries.v1";
const KEY_DRAFT = "tozumlo.journal.draft.v1";

/* --------------------------------- helpers -------------------------------- */

function safeRead<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ------------------------------- entries API ------------------------------ */

export function loadEntries(): JournalEntry[] {
  return safeRead<JournalEntry[]>(KEY_ENTRIES) ?? [];
}

export function saveEntries(entries: JournalEntry[]) {
  safeWrite(KEY_ENTRIES, entries);
}

export function upsertEntry(entries: JournalEntry[], entry: JournalEntry) {
  const idx = entries.findIndex((e) => e.id === entry.id);
  const next =
    idx === -1 ? [entry, ...entries] : entries.map((e, i) => (i === idx ? entry : e));
  saveEntries(next);
  return next;
}

export function deleteEntry(entries: JournalEntry[], id: string) {
  const next = entries.filter((e) => e.id !== id);
  saveEntries(next);
  return next;
}

/* ------------------------------- draft API -------------------------------- */

export function loadDraft(): JournalDraft | null {
  return safeRead<JournalDraft>(KEY_DRAFT);
}

export function saveDraft(d: JournalDraft) {
  safeWrite(KEY_DRAFT, d);
}

export function clearDraft() {
  safeRemove(KEY_DRAFT);
}

/* --------------------------------- ids ----------------------------------- */

export function newId() {
  return `je_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* -------------------------------- helpers -------------------------------- */

export function dateKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function dateLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function previewOf(body: string, max = 120) {
  const trimmed = body.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1) + "…";
}
