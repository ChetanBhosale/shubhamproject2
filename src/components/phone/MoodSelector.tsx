"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Headphones,
  Sparkles,
  Wind,
  ChevronRight,
} from "lucide-react";

/* --------------------------------- types --------------------------------- */

type MoodId =
  | "happy"
  | "calm"
  | "motivated"
  | "sleepy"
  | "anxious"
  | "angry";

type Mood = {
  id: MoodId;
  label: string;
  tint: string;            // pill background
  ink: string;             // pill text
  glow: string;            // soft halo
  ambient: string;         // background wash when selected
  insight: string;         // AI line under the reveal panel
  recommendation: string;  // short coaching line
};

const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Happy",
    tint: "#FFE7B5",
    ink: "#5B4416",
    glow: "rgba(245,176,65,0.45)",
    ambient: "rgba(255,224,170,0.55)",
    insight: "You're radiating warmth today. Let's protect that light.",
    recommendation: "Bookmark this feeling — a 1-min gratitude note keeps it close.",
  },
  {
    id: "calm",
    label: "Calm",
    tint: "#D8E7DC",
    ink: "#2E4A3A",
    glow: "rgba(112,168,144,0.4)",
    ambient: "rgba(216,231,220,0.55)",
    insight: "A clear, even rhythm. Stay with it gently.",
    recommendation: "A 4-4-6 box breath will deepen what you've already found.",
  },
  {
    id: "motivated",
    label: "Motivated",
    tint: "#F9D6BD",
    ink: "#6B3514",
    glow: "rgba(246,154,74,0.45)",
    ambient: "rgba(249,214,189,0.55)",
    insight: "Momentum's on your side. Channel it into one quiet win.",
    recommendation: "Pick one small step. We'll log it as a streak.",
  },
  {
    id: "sleepy",
    label: "Sleepy",
    tint: "#D9DAEE",
    ink: "#3A3D6B",
    glow: "rgba(117,121,170,0.45)",
    ambient: "rgba(217,218,238,0.55)",
    insight: "Your body is asking for softness. Listen quietly.",
    recommendation: "A short body scan + dim mode for the next hour.",
  },
  {
    id: "anxious",
    label: "Anxious",
    tint: "#EAD6E4",
    ink: "#5A3A52",
    glow: "rgba(150,98,140,0.4)",
    ambient: "rgba(234,214,228,0.55)",
    insight: "Something feels heavy. We'll move through it slowly.",
    recommendation: "Try 5-4-3-2-1 grounding. I'll guide each step.",
  },
  {
    id: "angry",
    label: "Angry",
    tint: "#F6CBB3",
    ink: "#6A2E15",
    glow: "rgba(220,98,55,0.45)",
    ambient: "rgba(246,203,179,0.55)",
    insight: "Heat is real. Let it pass through you, not at you.",
    recommendation: "60 seconds of long exhales lowers the wave.",
  },
];

/* --------------------------- public component ---------------------------- */

export default function MoodSelector({
  onChange,
}: {
  onChange?: (m: MoodId | null) => void;
}) {
  const [active, setActive] = useState<MoodId | null>(null);
  const mood = MOODS.find((m) => m.id === active) ?? null;

  useEffect(() => onChange?.(active), [active, onChange]);

  return (
    <div className="relative">
      {/* Ambient wash behind the row */}
      <AnimatePresence>
        {mood && (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-6 -z-10 h-44 blur-2xl"
            style={{
              background: `radial-gradient(60% 80% at 50% 30%, ${mood.ambient}, transparent 75%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Pills */}
      <div
        className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MOODS.map((m) => {
          const isActive = active === m.id;
          const isDimmed = active !== null && !isActive;
          return (
            <motion.button
              key={m.id}
              layout
              onClick={() => setActive((prev) => (prev === m.id ? null : m.id))}
              whileTap={{ scale: 0.93 }}
              animate={{
                opacity: isDimmed ? 0.45 : 1,
                scale: isActive ? 1.04 : 1,
                filter: isDimmed ? "saturate(0.7)" : "saturate(1)",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="relative flex shrink-0 items-center"
              aria-pressed={isActive}
              aria-label={`Select mood ${m.label}`}
            >
              {/* soft glow when active */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="moodHalo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 -z-10 rounded-full blur-xl"
                    style={{ backgroundColor: m.glow }}
                  />
                )}
              </AnimatePresence>

              {/* face square */}
              <span
                className="relative z-10 -mr-3 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900"
                style={{
                  backgroundColor: m.tint,
                  boxShadow: isActive
                    ? "3px 3px 0 0 rgba(24,24,27,0.95)"
                    : "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                <MoodFace id={m.id} active={isActive} ink={m.ink} />
              </span>

              {/* label pill */}
              <motion.span
                layout
                className="rounded-full border-2 border-zinc-900 bg-white py-1 pl-5 pr-3.5 text-[12px] font-bold text-zinc-900"
                style={{
                  boxShadow: isActive
                    ? "3px 3px 0 0 rgba(24,24,27,0.95)"
                    : "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                {m.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {/* Reveal: emotional insight + wellness flow */}
      <AnimatePresence initial={false} mode="popLayout">
        {mood && <RevealPanel key={mood.id} mood={mood} />}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- reveal panel ----------------------------- */

function RevealPanel({ mood }: { mood: Mood }) {
  const flows = flowsFor(mood.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 8, height: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="overflow-hidden"
    >
      <div className="mt-4">
        {/* AI insight */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 24 }}
          className="rounded-[22px] border-2 border-zinc-900 px-3 py-3"
          style={{
            backgroundColor: mood.tint,
            boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <span
              className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <div className="leading-snug">
              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
                style={{ color: mood.ink }}
              >
                Lumi · sensing your mood
              </p>
              <p
                className="mt-0.5 text-[13px] font-extrabold tracking-tight"
                style={{ color: mood.ink }}
              >
                {mood.insight}
              </p>
              <p className="mt-1 text-[11.5px] font-medium" style={{ color: mood.ink, opacity: 0.85 }}>
                {mood.recommendation}
              </p>
            </div>
          </div>
        </motion.div>

        {/* wellness flow chips */}
        <motion.div
          layout
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
          }}
          className="mt-3 grid grid-cols-2 gap-2"
        >
          {flows.map((f) => (
            <motion.button
              key={f.label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 280, damping: 22 },
                },
              }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 rounded-2xl border-2 border-zinc-900 bg-white px-3 py-2.5 text-left"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-zinc-900"
                style={{
                  backgroundColor: mood.tint,
                  color: mood.ink,
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                {f.icon}
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-[12px] font-extrabold text-zinc-900">{f.label}</p>
                <p className="text-[10.5px] text-zinc-600">{f.sub}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2.4} />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function flowsFor(id: MoodId) {
  switch (id) {
    case "happy":
      return [
        { label: "Capture it", sub: "1-min gratitude note", icon: <BookOpen className="h-4 w-4" strokeWidth={2.4} /> },
        { label: "Soft playlist", sub: "Sun-warm tones", icon: <Headphones className="h-4 w-4" strokeWidth={2.4} /> },
      ];
    case "calm":
      return [
        { label: "Box breath", sub: "4 · 4 · 6, 1 min", icon: <Wind className="h-4 w-4" strokeWidth={2.4} /> },
        { label: "Body scan", sub: "5-min ambient", icon: <Headphones className="h-4 w-4" strokeWidth={2.4} /> },
      ];
    case "motivated":
      return [
        { label: "One small step", sub: "Add to streak", icon: <Sparkles className="h-4 w-4" strokeWidth={2.4} /> },
        { label: "Focus tone", sub: "25-min flow", icon: <Headphones className="h-4 w-4" strokeWidth={2.4} /> },
      ];
    case "sleepy":
      return [
        { label: "Wind down", sub: "Sleep recovery", icon: <Wind className="h-4 w-4" strokeWidth={2.4} /> },
        { label: "Sleep story", sub: "12-min drift", icon: <Headphones className="h-4 w-4" strokeWidth={2.4} /> },
      ];
    case "anxious":
      return [
        { label: "5-4-3-2-1", sub: "Grounding · 90s", icon: <Wind className="h-4 w-4" strokeWidth={2.4} /> },
        { label: "Tell Lumi", sub: "Talk it out", icon: <Sparkles className="h-4 w-4" strokeWidth={2.4} /> },
      ];
    case "angry":
      return [
        { label: "Long exhale", sub: "60s · cool down", icon: <Wind className="h-4 w-4" strokeWidth={2.4} /> },
        { label: "Vent page", sub: "Private journal", icon: <BookOpen className="h-4 w-4" strokeWidth={2.4} /> },
      ];
  }
}

/* -------------------------- per-mood face icons -------------------------- */

function MoodFace({
  id,
  active,
  ink,
}: {
  id: MoodId;
  active: boolean;
  ink: string;
}) {
  const stroke = "#1B1B1B";

  switch (id) {
    case "happy":
      return (
        <motion.svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          animate={
            active
              ? { y: [0, -2, 0, -1, 0], rotate: [0, -3, 0, 3, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: 1.6,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <path d="M7 11c1-1 2-1 3 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 11c1-1 2-1 3 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 15c1.2 1 4.8 1 6 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          {active && (
            <>
              <Particle cx={3} cy={5} delay={0} color={ink} />
              <Particle cx={20} cy={4} delay={0.4} color={ink} />
              <Particle cx={22} cy={16} delay={0.8} color={ink} />
            </>
          )}
        </motion.svg>
      );

    case "calm":
      return (
        <motion.svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          animate={
            active
              ? { scale: [1, 1.06, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: 4,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <path d="M7 12c0.7-1 1.7-1 3 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 12c1.3-1 2.3-1 3 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 15c1.2 0.5 4.8 0.5 6 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </motion.svg>
      );

    case "motivated":
      return (
        <motion.svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          animate={
            active
              ? { y: [0, -3, 0], scale: [1, 1.08, 1] }
              : { y: 0, scale: 1 }
          }
          transition={{
            duration: 1.4,
            repeat: active ? Infinity : 0,
            ease: "easeOut",
          }}
        >
          <path d="M9 11l3-3 3 3" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="14" r="0.9" fill={stroke} />
          <circle cx="15" cy="14" r="0.9" fill={stroke} />
          <path d="M9 17c1 0.5 5 0.5 6 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </motion.svg>
      );

    case "sleepy":
      return (
        <motion.svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          animate={active ? { rotate: [0, -4, 0, 4, 0] } : { rotate: 0 }}
          transition={{
            duration: 4,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <path d="M7 12c1-0.6 2-0.6 3 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 12c1-0.6 2-0.6 3 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9.5 16h5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          {active && (
            <motion.text
              x="17"
              y="8"
              fontSize="6"
              fontWeight="700"
              fill={stroke}
              animate={{ opacity: [0, 1, 0], y: [8, 4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              z
            </motion.text>
          )}
        </motion.svg>
      );

    case "anxious":
      return (
        <motion.svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          animate={active ? { x: [0, -1, 1, -1, 1, 0] } : { x: 0 }}
          transition={{
            duration: 0.6,
            repeat: active ? Infinity : 0,
            repeatDelay: 1.6,
            ease: "easeInOut",
          }}
        >
          <circle cx="9.5" cy="11" r="0.9" fill={stroke} />
          <circle cx="14.5" cy="11" r="0.9" fill={stroke} />
          <path d="M9 16q1.5 -1 3 0 1.5 1 3 0" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </motion.svg>
      );

    case "angry":
      return (
        <motion.svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          animate={
            active
              ? { scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{
            duration: 0.9,
            repeat: active ? Infinity : 0,
            repeatDelay: 0.4,
            ease: "easeInOut",
          }}
        >
          <path d="M7 9.5l3 1.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M17 9.5l-3 1.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="9.5" cy="12" r="0.9" fill={stroke} />
          <circle cx="14.5" cy="12" r="0.9" fill={stroke} />
          <path d="M9 16c1.2-1.2 4.8-1.2 6 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </motion.svg>
      );
  }
}

/* small floating dot */
function Particle({
  cx,
  cy,
  delay,
  color,
}: {
  cx: number;
  cy: number;
  delay: number;
  color: string;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="0.9"
      fill={color}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: [0, 1, 0], y: [4, -4, -10] }}
      transition={{ duration: 1.8, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}
