"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bed,
  BookOpen,
  ChevronLeft,
  Compass,
  Droplet,
  Lightbulb,
  Moon,
  Sun,
  Wind,
  X,
} from "../icons";
import { COLORS } from "../ui";

type Reminder = {
  id: string;
  label: string;
  sub: string;
  time: string;        // "HH:MM"
  on: boolean;
  bg: string;
  ink: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const SEED: Reminder[] = [
  {
    id: "sleep",
    label: "Sleep wind-down",
    sub: "Soft cue for bed",
    time: "22:15",
    on: true,
    bg: COLORS.lavender,
    ink: "#3A3D6B",
    Icon: Moon,
  },
  {
    id: "journal",
    label: "Evening journal",
    sub: "Two-line reflection",
    time: "21:00",
    on: true,
    bg: COLORS.butter,
    ink: "#5B4416",
    Icon: BookOpen,
  },
  {
    id: "meditate",
    label: "Meditation",
    sub: "Box breath · 4·4·6",
    time: "08:30",
    on: false,
    bg: COLORS.sage,
    ink: "#2E4A3A",
    Icon: Wind,
  },
  {
    id: "water",
    label: "Hydration",
    sub: "Every 90 minutes",
    time: "10:00",
    on: true,
    bg: COLORS.blue,
    ink: "#27506C",
    Icon: Droplet,
  },
  {
    id: "detox",
    label: "Digital detox",
    sub: "Phone away after 9:30",
    time: "21:30",
    on: false,
    bg: COLORS.peachSoft,
    ink: "#7A4534",
    Icon: Bed,
  },
  {
    id: "morning",
    label: "Morning reflection",
    sub: "Set one intention",
    time: "07:30",
    on: true,
    bg: COLORS.warmOrange,
    ink: "#5B2E0E",
    Icon: Sun,
  },
];

export default function RemindersFlow({ onClose }: { onClose: () => void }) {
  const [list, setList] = useState<Reminder[]>(SEED);
  const [editing, setEditing] = useState<string | null>(null);

  function toggle(id: string) {
    setList((arr) => arr.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));
  }
  function setTime(id: string, time: string) {
    setList((arr) => arr.map((r) => (r.id === id ? { ...r, time } : r)));
  }

  return (
    <FlowShell title="Reminders" onClose={onClose}>
      {/* AI suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.05 }}
        className="rounded-[20px] border-2 border-zinc-900 px-3 py-2.5"
        style={{
          backgroundColor: COLORS.sage,
          boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
        }}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
          >
            <Lightbulb className="h-3.5 w-3.5" />
          </span>
          <div className="leading-snug">
            <p
              className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#2E4A3A" }}
            >
              Lumi · gentle suggestion
            </p>
            <p
              className="mt-0.5 text-[12.5px] font-extrabold tracking-tight"
              style={{ color: "#2E4A3A" }}
            >
              Your ideal sleep reminder is around 10:15 PM.
            </p>
            <p
              className="mt-0.5 text-[11px] font-medium"
              style={{ color: "#2E4A3A", opacity: 0.85 }}
            >
              You've fallen asleep faster on nights you were nudged before 10:30.
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex gap-2">
          <SoftPill onClick={() => setTime("sleep", "22:15")}>
            Use 10:15 PM
          </SoftPill>
          <SoftPill onClick={() => {}}>Softer cues tonight</SoftPill>
        </div>
      </motion.div>

      {/* list */}
      <div className="mt-3 space-y-2.5">
        {list.map((r, i) => (
          <ReminderRow
            key={r.id}
            reminder={r}
            index={i}
            editing={editing === r.id}
            onToggle={() => toggle(r.id)}
            onEditOpen={() => setEditing(editing === r.id ? null : r.id)}
            onTime={(t) => setTime(r.id, t)}
          />
        ))}
      </div>
    </FlowShell>
  );
}

function ReminderRow({
  reminder,
  index,
  editing,
  onToggle,
  onEditOpen,
  onTime,
}: {
  reminder: Reminder;
  index: number;
  editing: boolean;
  onToggle: () => void;
  onEditOpen: () => void;
  onTime: (t: string) => void;
}) {
  const Icon = reminder.Icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 26,
        delay: 0.08 + index * 0.04,
      }}
      className="overflow-hidden rounded-[20px] border-2 border-zinc-900"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      <div
        onClick={onEditOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onEditOpen();
        }}
        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900"
          style={{
            backgroundColor: reminder.bg,
            color: reminder.ink,
            boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-[13px] font-extrabold text-zinc-900">
            {reminder.label}
          </p>
          <p className="text-[10.5px] text-zinc-600">
            {to12h(reminder.time)} · {reminder.sub}
          </p>
        </div>
        <SoftToggle on={reminder.on} onClick={onToggle} />
      </div>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="overflow-hidden"
          >
            <div
              className="border-t-2 border-zinc-900/10 px-3 py-3"
              style={{ backgroundColor: reminder.bg }}
            >
              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
                style={{ color: reminder.ink, opacity: 0.85 }}
              >
                When should we whisper?
              </p>
              <TimeWheel value={reminder.time} onChange={onTime} ink={reminder.ink} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* a soft scroll-snap time picker (hours / minutes columns) */
function TimeWheel({
  value,
  onChange,
  ink,
}: {
  value: string;
  onChange: (v: string) => void;
  ink: string;
}) {
  const [h, m] = value.split(":");
  const hour = Number(h);
  const minute = Number(m);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="mt-3 flex items-center gap-3">
      <Wheel
        items={hours}
        value={hour}
        format={(v) => String(v).padStart(2, "0")}
        ink={ink}
        onChange={(v) => onChange(`${pad(v)}:${pad(minute)}`)}
      />
      <span className="text-[20px] font-extrabold" style={{ color: ink }}>
        :
      </span>
      <Wheel
        items={minutes}
        value={minute}
        format={(v) => String(v).padStart(2, "0")}
        ink={ink}
        onChange={(v) => onChange(`${pad(hour)}:${pad(v)}`)}
      />
      <p className="ml-auto text-[10.5px] font-bold" style={{ color: ink }}>
        {to12hMeridiem(hour)}
      </p>
    </div>
  );
}

function Wheel({
  items,
  value,
  format,
  ink,
  onChange,
}: {
  items: number[];
  value: number;
  format: (v: number) => string;
  ink: string;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="relative h-24 w-16 overflow-hidden rounded-2xl border-2 border-zinc-900 bg-white"
      style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-7"
        style={{
          background:
            "linear-gradient(0deg, rgba(255,255,255,0.95), rgba(255,255,255,0))",
        }}
      />
      <div
        className="h-full snap-y snap-mandatory overflow-y-auto py-9 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={(el) => {
          if (!el) return;
          const i = items.indexOf(value);
          if (i >= 0) el.scrollTo({ top: i * 24, behavior: "auto" });
        }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollTop / 24);
          const v = items[Math.max(0, Math.min(items.length - 1, i))];
          if (v !== value) onChange(v);
        }}
      >
        {items.map((v) => (
          <div
            key={v}
            className="flex h-6 snap-center items-center justify-center text-[14px] font-extrabold"
            style={{ color: v === value ? ink : "rgba(24,24,27,0.35)" }}
          >
            {format(v)}
          </div>
        ))}
      </div>
    </div>
  );
}

function SoftToggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileTap={{ scale: 0.92 }}
      className="relative h-7 w-12 rounded-full border-2 border-zinc-900"
      style={{
        backgroundColor: on ? "#3F8B7C" : "#fff",
        boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
      aria-pressed={on}
    >
      <motion.span
        animate={{ x: on ? 18 : 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full border-2 border-zinc-900 bg-white"
      />
    </motion.button>
  );
}

function SoftPill({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-900"
      style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
    >
      {children}
    </motion.button>
  );
}

/* ----------------------------- shared shell ---------------------------- */

export function FlowShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="absolute inset-0 z-40"
      style={{ backgroundColor: "#FAF6EF" }}
    >
      <div className="absolute inset-0 overflow-y-auto pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="px-5 pt-12">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <p className="text-[12.5px] font-extrabold tracking-tight text-zinc-900">
              {title}
            </p>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* unused safety guard for a Compass import (keeps tree-shake happy if removed) */
void Compass;

/* ------------------------------ utilities ------------------------------ */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hr = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hr}:${pad(m)} ${ampm}`;
}

function to12hMeridiem(h: number) {
  return h >= 12 ? "PM" : "AM";
}

/* hush unused lint hint */
void useEffect;
