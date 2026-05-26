"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus } from "../icons";
import {
  COLORS,
  NeoCard,
  ScreenShell,
  item,
  useTheme,
} from "../ui";
import { useEffect, useRef, useState } from "react";
import JournalEditor, { type EditorOpen } from "../journal/JournalEditor";
import JournalTimeline from "../journal/JournalTimeline";
import {
  JournalEntry,
  deleteEntry,
  loadEntries,
  saveEntries,
  upsertEntry,
} from "../journal/storage";

const PROMPTS = [
  { q: "What made you smile today?", bg: COLORS.sage, t: "2 min" },
  { q: "What drained your energy?", bg: COLORS.peachSoft, t: "3 min" },
  { q: "Three things you’re grateful for", bg: COLORS.butter, t: "2 min" },
];

const TAGS = [
  { t: "calm", c: COLORS.sage },
  { t: "tired", c: COLORS.lavender },
  { t: "proud", c: COLORS.butter },
  { t: "anxious", c: COLORS.peachSoft },
  { t: "loved", c: COLORS.rose },
];

const STREAK = [
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 0],
];

export default function JournalScreen() {
  const { ink, muted } = useTheme();
  const [active, setActive] = useState(new Set<string>(["calm"]));
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editor, setEditor] = useState<EditorOpen | null>(null);
  const [origin, setOrigin] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const newBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* hydrate entries on mount */
  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  function openNew(prompt?: string) {
    const btn = newBtnRef.current;
    const container = containerRef.current;
    if (btn && container) {
      const b = btn.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      setOrigin({
        top: b.top - c.top,
        left: b.left - c.left,
        width: b.width,
        height: b.height,
      });
    } else {
      setOrigin(null);
    }
    setEditor({ mode: "new", prompt });
  }

  function openExisting(entry: JournalEntry) {
    setOrigin(null);
    setEditor({ mode: "edit", entry });
  }

  function handleSave(entry: JournalEntry) {
    setEntries((prev) => {
      const next = upsertEntry(prev, entry);
      return next;
    });
  }

  function handleClose() {
    setEditor(null);
  }

  function handleToggleFavorite(id: string) {
    setEntries((prev) => {
      const next = prev.map((e) =>
        e.id === id ? { ...e, favorite: !e.favorite } : e,
      );
      saveEntries(next);
      return next;
    });
  }

  function handleDelete(id: string) {
    setEntries((prev) => deleteEntry(prev, id));
  }

  return (
    <div ref={containerRef} className="relative">
      <ScreenShell>
        <motion.div
          variants={item}
          className="mt-1 flex items-center justify-between"
        >
          <div className="leading-tight">
            <p className="text-[11px]" style={{ color: muted }}>
              Tuesday · journal
            </p>
            <p className="text-[15px] font-extrabold" style={{ color: ink }}>
              My pages
            </p>
          </div>
          <button
            ref={newBtnRef}
            onClick={() => openNew()}
            className="flex items-center gap-1 rounded-2xl border-2 border-zinc-900 bg-zinc-900 px-3 py-2 text-[12px] font-bold text-white"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-3 text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em]"
          style={{ color: ink }}
        >
          What’s the story
          <br />
          of today?
        </motion.h1>

        <motion.div variants={item} className="mt-4 space-y-3">
          {PROMPTS.map((p, i) => (
            <NeoCard key={i} bg={p.bg} padding="p-3" onClick={() => openNew(p.q)}>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-zinc-900">{p.q}</p>
                <BookOpen className="h-4 w-4" />
              </div>
              <p className="mt-1 text-[10.5px] text-zinc-700">
                Tap to write · {p.t}
              </p>
            </NeoCard>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-4">
          <p
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: muted }}
          >
            Mood tags
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const on = active.has(t.t);
              return (
                <motion.button
                  key={t.t}
                  whileTap={{ scale: 0.94 }}
                  onClick={() =>
                    setActive((s) => {
                      const ns = new Set(s);
                      if (ns.has(t.t)) ns.delete(t.t);
                      else ns.add(t.t);
                      return ns;
                    })
                  }
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
        </motion.div>

        <motion.div variants={item} className="mt-4">
          <NeoCard bg="#ffffff" padding="p-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold text-zinc-900">
                28-day streak
              </p>
              <p className="text-[11px] text-zinc-500">June</p>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {STREAK.flat().map((d, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2 + i * 0.012,
                  }}
                  className="h-5 w-full rounded-md border-2 border-zinc-900"
                  style={{ backgroundColor: d ? COLORS.sage : "#ffffff" }}
                />
              ))}
            </div>
          </NeoCard>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={item} className="mt-5">
          <p
            className="mb-2 text-[11px] font-bold uppercase tracking-widest"
            style={{ color: muted }}
          >
            Recent entries
          </p>
          <JournalTimeline
            entries={entries}
            onOpen={openExisting}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        </motion.div>
      </ScreenShell>

      {/* Fullscreen editor overlay */}
      <JournalEditor
        open={editor}
        origin={origin}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
}
