"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Heart, Pencil, Trash2 } from "../icons";
import { useMemo, useState } from "react";
import { COLORS } from "../ui";
import {
  JournalEntry,
  dateLabel,
  previewOf,
  timeLabel,
} from "./storage";

const MOOD_TINT: Record<string, string> = {
  calm: COLORS.sage,
  tired: COLORS.lavender,
  proud: COLORS.butter,
  anxious: COLORS.peachSoft,
  loved: COLORS.rose,
  grateful: COLORS.mintSoft,
};

export default function JournalTimeline({
  entries,
  onOpen,
  onToggleFavorite,
  onDelete,
}: {
  entries: JournalEntry[];
  onOpen: (e: JournalEntry) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const groups = useMemo(() => groupByDay(entries), [entries]);

  if (entries.length === 0) {
    return (
      <div
        className="rounded-[22px] border-2 border-dashed border-zinc-900/40 bg-white/60 p-4 text-center"
      >
        <p className="text-[12.5px] font-semibold text-zinc-700">
          Your reflections will gather here.
        </p>
        <p className="mt-1 text-[10.5px] text-zinc-500">
          Tap "+ New" to begin a soft entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            {g.label}
          </p>
          <div className="space-y-2.5">
            {g.entries.map((e) => (
              <EntryCard
                key={e.id}
                entry={e}
                onOpen={() => onOpen(e)}
                onToggleFavorite={() => onToggleFavorite(e.id)}
                onDelete={() => onDelete(e.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EntryCard({
  entry,
  onOpen,
  onToggleFavorite,
  onDelete,
}: {
  entry: JournalEntry;
  onOpen: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moodTint = entry.moods?.[0]
    ? MOOD_TINT[entry.moods[0]] ?? "#FFFFFF"
    : "#FFFFFF";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="overflow-hidden rounded-[20px] border-2 border-zinc-900"
      style={{
        backgroundColor: moodTint,
        boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left"
      >
        <div className="flex-1 leading-snug">
          <div className="flex items-center gap-1.5">
            <p className="text-[10.5px] font-semibold text-zinc-700">
              {timeLabel(entry.createdAt)}
            </p>
            {entry.favorite && (
              <Heart
                className="h-3 w-3"
                weight="fill"
                color="#C56B3F"
              />
            )}
            {entry.moods.slice(0, 3).map((m) => (
              <span
                key={m}
                className="rounded-full border border-zinc-900/30 bg-white/70 px-1.5 py-0 text-[9.5px] font-bold text-zinc-800"
              >
                #{m}
              </span>
            ))}
          </div>
          {entry.prompt && (
            <p className="mt-0.5 text-[11.5px] font-bold text-zinc-900">
              {entry.prompt}
            </p>
          )}
          <p className="mt-0.5 text-[12.5px] font-medium leading-snug text-zinc-800">
            {expanded ? entry.body : previewOf(entry.body)}
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 text-zinc-700 transition-transform"
         
          style={{
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center gap-2 border-t-2 border-zinc-900/10 bg-white/60 px-3 py-2"
            >
              <Action
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                icon={<Pencil className="h-3.5 w-3.5" />}
                label="Continue"
              />
              <Action
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                icon={
                  <Heart
                    className="h-3.5 w-3.5"
                    weight={entry.favorite ? "fill" : "regular"}
                    color={entry.favorite ? "#C56B3F" : undefined}
                  />
                }
                label={entry.favorite ? "Memory" : "Favorite"}
              />
              <Action
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                icon={<Trash2 className="h-3.5 w-3.5" />}
                label="Delete"
                tone="danger"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="border-t-2 border-zinc-900/10 bg-white/85 px-3 py-2.5"
          >
            <p className="text-[12px] font-semibold text-zinc-800">
              Let this entry go softly?
            </p>
            <div className="mt-1.5 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(false);
                  onDelete();
                }}
                className="flex-1 rounded-full border-2 border-zinc-900 bg-zinc-900 py-1.5 text-[11.5px] font-extrabold text-white"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                Release
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(false);
                }}
                className="flex-1 rounded-full border-2 border-zinc-900 bg-white py-1.5 text-[11.5px] font-extrabold text-zinc-900"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                Keep
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Action({
  onClick,
  icon,
  label,
  tone,
}: {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  tone?: "danger";
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1 text-[11px] font-bold"
      style={{
        color: tone === "danger" ? "#9C2A1B" : "#1B1B1B",
        boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function groupByDay(entries: JournalEntry[]) {
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  const map = new Map<string, JournalEntry[]>();
  for (const e of sorted) {
    const key = dateLabel(e.createdAt);
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([label, entries]) => ({ label, entries }));
}
