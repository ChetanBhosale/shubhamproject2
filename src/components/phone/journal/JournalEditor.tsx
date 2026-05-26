"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Check,
  Headphones,
  ImageIcon,
  Mic,
  Save,
  X,
} from "../icons";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { COLORS } from "../ui";
import {
  JournalDraft,
  JournalEntry,
  clearDraft,
  loadDraft,
  newId,
  saveDraft,
  timeLabel,
} from "./storage";

const PROMPTS = [
  "How are you feeling right now?",
  "What's been on your mind today?",
  "What felt important today?",
  "What are you carrying emotionally tonight?",
];

const TAGS: { t: string; c: string }[] = [
  { t: "calm", c: COLORS.sage },
  { t: "tired", c: COLORS.lavender },
  { t: "proud", c: COLORS.butter },
  { t: "anxious", c: COLORS.peachSoft },
  { t: "loved", c: COLORS.rose },
  { t: "grateful", c: COLORS.mintSoft },
];

const SOUNDS = ["Quiet", "Rain", "Forest", "Ocean"] as const;

export type EditorOpen =
  | { mode: "new"; prompt?: string }
  | { mode: "edit"; entry: JournalEntry };

type Props = {
  open: EditorOpen | null;
  /** Initial position of the trigger button (for the morph animation). */
  origin: { top: number; left: number; width: number; height: number } | null;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
};

export default function JournalEditor({ open, origin, onClose, onSave }: Props) {
  const editing = open?.mode === "edit" ? open.entry : null;
  const initialPrompt = useMemo(() => {
    if (open?.mode === "new") return open.prompt ?? randomFrom(PROMPTS);
    if (editing) return editing.prompt ?? "";
    return "";
  }, [open, editing]);

  const [body, setBody] = useState("");
  const [moods, setMoods] = useState<string[]>([]);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [savedHint, setSavedHint] = useState<"draft" | "saved" | null>(null);
  const [restored, setRestored] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [sound, setSound] = useState<(typeof SOUNDS)[number]>("Quiet");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* hydrate state when editor opens */
  useEffect(() => {
    if (!open) return;
    if (open.mode === "edit") {
      setBody(open.entry.body);
      setMoods(open.entry.moods ?? []);
      setPrompt(open.entry.prompt ?? "");
      setRestored(false);
      return;
    }
    // new entry — restore draft if present
    const d = loadDraft();
    if (d && d.body.trim().length > 0) {
      setBody(d.body);
      setMoods(d.moods ?? []);
      setPrompt(d.prompt ?? initialPrompt);
      setRestored(true);
    } else {
      setBody("");
      setMoods([]);
      setPrompt(initialPrompt);
      setRestored(false);
    }
  }, [open, initialPrompt]);

  /* focus textarea after the open animation settles */
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => textareaRef.current?.focus(), 380);
    return () => window.clearTimeout(id);
  }, [open]);

  /* autosave drafts (only for new entries) */
  useEffect(() => {
    if (!open || open.mode !== "new") return;
    if (body.trim().length === 0 && moods.length === 0) {
      // nothing meaningful — drop draft
      clearDraft();
      return;
    }
    const id = window.setTimeout(() => {
      const d: JournalDraft = {
        body,
        moods,
        prompt,
        updatedAt: Date.now(),
      };
      saveDraft(d);
      setSavedHint("draft");
      window.setTimeout(() => setSavedHint(null), 1400);
    }, 600);
    return () => window.clearTimeout(id);
  }, [body, moods, prompt, open]);

  const handleClose = useCallback(() => {
    // If user backs out of a fresh entry with content, the autosave already wrote draft.
    if (open?.mode === "new" && body.trim().length > 0) {
      setSavedHint("draft");
      window.setTimeout(() => setSavedHint(null), 1400);
    }
    onClose();
  }, [open, body, onClose]);

  /* ESC key closes editor */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  function toggleMood(t: string) {
    setMoods((m) => (m.includes(t) ? m.filter((x) => x !== t) : [...m, t]));
  }

  function commit() {
    const trimmed = body.trim();
    if (trimmed.length === 0 && moods.length === 0) {
      handleClose();
      return;
    }
    const now = Date.now();
    const entry: JournalEntry =
      editing
        ? {
            ...editing,
            body: trimmed,
            moods,
            prompt,
            updatedAt: now,
          }
        : {
            id: newId(),
            createdAt: now,
            updatedAt: now,
            body: trimmed,
            moods,
            prompt,
          };
    onSave(entry);
    clearDraft();
    setShowSaved(true);
    window.setTimeout(() => {
      setShowSaved(false);
      onClose();
    }, 900);
  }

  /* morph animation: from button origin to fullscreen sheet */
  const transition = { type: "spring" as const, stiffness: 280, damping: 30 };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* dim + blur backdrop */}
          <motion.div
            key="jb-backdrop"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" as unknown as string }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" as unknown as string }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" as unknown as string }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-40 bg-zinc-900/15"
            onClick={handleClose}
          />

          {/* morphing sheet */}
          <motion.div
            key="jb-sheet"
            initial={
              origin
                ? {
                    top: origin.top,
                    left: origin.left,
                    width: origin.width,
                    height: origin.height,
                    borderRadius: 18,
                    opacity: 0.6,
                  }
                : { opacity: 0, scale: 0.96 }
            }
            animate={
              origin
                ? {
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 0,
                    opacity: 1,
                  }
                : { opacity: 1, scale: 1 }
            }
            exit={
              origin
                ? {
                    top: origin.top,
                    left: origin.left,
                    width: origin.width,
                    height: origin.height,
                    borderRadius: 18,
                    opacity: 0,
                  }
                : { opacity: 0, scale: 0.98 }
            }
            transition={transition}
            className="absolute z-50 overflow-hidden"
            style={{
              backgroundColor: "#FAF6EF",
              boxShadow: "0 18px 40px -16px rgba(40,30,15,0.4)",
            }}
          >
            <div className="flex h-full flex-col">
              {/* top bar */}
              <div
                className="flex items-center justify-between px-5 pt-12"
                style={{ color: "#1B1B1B" }}
              >
                <button
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
                  style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center leading-tight">
                  <span
                    className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500"
                  >
                    {dateHeader()}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-700">
                    {timeLabel(Date.now())}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={commit}
                  className="flex items-center gap-1 rounded-full border-2 border-zinc-900 px-3 py-1.5 text-[11.5px] font-extrabold tracking-tight text-white"
                  style={{
                    background:
                      "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                    boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                  }}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </motion.button>
              </div>

              {/* draft restored chip */}
              <AnimatePresence>
                {restored && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mx-5 mt-3 flex items-center justify-between rounded-full border-2 border-zinc-900 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-800"
                    style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                  >
                    <span>Your draft is safely saved.</span>
                    <button
                      onClick={() => {
                        setRestored(false);
                        setBody("");
                        clearDraft();
                      }}
                      className="text-[10.5px] font-bold text-zinc-500 underline-offset-2 hover:underline"
                    >
                      Start fresh
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* prompt */}
              <div className="px-5 pt-4">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500"
                >
                  Prompt
                </p>
                <button
                  onClick={() => setPrompt(randomFrom(PROMPTS, prompt))}
                  className="mt-1 text-left text-[20px] font-extrabold leading-tight tracking-[-0.01em] text-zinc-900"
                >
                  {prompt}
                </button>
                <p className="mt-1 text-[10.5px] text-zinc-500">
                  Tap to swap · let one land softly.
                </p>
              </div>

              {/* writing area */}
              <div className="relative flex-1 px-5 pt-3">
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Begin gently…"
                  spellCheck
                  className="h-full w-full resize-none border-0 bg-transparent text-[15px] leading-[1.65] text-zinc-900 outline-none placeholder:text-zinc-400"
                  style={{
                    fontFamily:
                      "ui-serif, Georgia, 'Iowan Old Style', 'Apple Garamond', Garamond, serif",
                    caretColor: "#3F8B7C",
                  }}
                />
                {/* subtle soft caret line indicator */}
                <CaretBreath />
              </div>

              {/* mood tags */}
              <div className="px-5 pb-2">
                <p
                  className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500"
                >
                  Mood
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {TAGS.map((t) => {
                    const on = moods.includes(t.t);
                    return (
                      <motion.button
                        key={t.t}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => toggleMood(t.t)}
                        className="rounded-full border-2 border-zinc-900 px-2.5 py-1 text-[11px] font-bold text-zinc-900"
                        style={{
                          backgroundColor: on ? t.c : "#fff",
                          boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                        }}
                      >
                        #{t.t}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* bottom action bar */}
              <div
                className="flex items-center justify-between gap-2 border-t border-zinc-900/10 px-5 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex items-center gap-2">
                  <ActionChip
                    icon={<Mic className="h-3.5 w-3.5" />}
                    label="Voice"
                  />
                  <ActionChip
                    icon={<ImageIcon className="h-3.5 w-3.5" />}
                    label="Image"
                  />
                  <ActionChip
                    icon={<Camera className="h-3.5 w-3.5" />}
                    label="Capture"
                  />
                  <SoundChip
                    sound={sound}
                    onChange={setSound}
                  />
                </div>

                <div className="flex items-center gap-2 text-[10.5px] font-medium text-zinc-500">
                  <span>{wordCount(body)} words</span>
                  <AnimatePresence>
                    {savedHint === "draft" && (
                      <motion.span
                        key="draft"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700"
                      >
                        Draft saved
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* save success overlay */}
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(250,246,239,0.85)", backdropFilter: "blur(2px)" }}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 8 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 360, damping: 22, delay: 0.05 }}
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-900 text-white"
                      style={{
                        background:
                          "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                        boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
                      }}
                    >
                      <Check className="h-6 w-6" />
                    </motion.span>
                    <p className="text-[14px] font-extrabold tracking-tight text-zinc-900">
                      Your reflection is safely stored.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ small pieces ------------------------------ */

function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
      style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function SoundChip({
  sound,
  onChange,
}: {
  sound: (typeof SOUNDS)[number];
  onChange: (s: (typeof SOUNDS)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ y: -1 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
        style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
      >
        <Headphones className="h-3.5 w-3.5" />
        {sound}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute bottom-full left-0 z-30 mb-2 rounded-2xl border-2 border-zinc-900 bg-white p-1.5"
            style={{ boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)" }}
          >
            <div className="flex flex-col gap-1">
              {SOUNDS.map((s) => {
                const on = s === sound;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onChange(s);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11.5px] font-bold text-zinc-900"
                    style={{
                      backgroundColor: on ? COLORS.sage : "transparent",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: on
                          ? "#1B1B1B"
                          : "rgba(24,24,27,0.25)",
                      }}
                    />
                    {s}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CaretBreath() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-5 top-3 h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: "#3F8B7C" }}
      animate={{ opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* --------------------------------- utils -------------------------------- */

function randomFrom<T>(arr: T[], avoid?: T): T {
  const pool = avoid !== undefined ? arr.filter((x) => x !== avoid) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function wordCount(s: string) {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function dateHeader() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
