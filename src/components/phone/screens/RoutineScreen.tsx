"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import {
  ArrowRight,
  Bed,
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  Coffee,
  Compass,
  Droplet,
  Flame,
  Footprints,
  GripVertical,
  Headphones,
  Heart,
  Leaf,
  Lightbulb,
  Moon,
  Pause,
  Play,
  Plus,
  Sun,
  Target,
  Trash2,
  Wind,
  X,
} from "../icons";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { ScreenShell, item, useTheme } from "../ui";

/* ---------------------------------- types --------------------------------- */

type GoalId = "sleep" | "stress" | "quiet-mind" | "focus" | "morning" | "reset";

type Goal = {
  id: GoalId;
  label: string;
  hint: string;
  tint: string;
  ink: string;
  glow: string;
  ambient: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

type Block = {
  id: string;
  label: string;
  duration: number; // minutes
  benefit: string;
  reasoning: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: string;
};

type Stage = "today" | "intent" | "build" | "execute";

/* -------------------------- today list persistence ------------------------ */

type TodayTask = {
  id: string;
  label: string;
  benefit: string;
  duration: number;
  done: boolean;
  tint: string;
  iconKey: keyof typeof ICON_MAP;
};

const ICON_MAP = {
  Bed,
  Compass,
  Coffee,
  Droplet,
  Footprints,
  Headphones,
  Leaf,
  Lightbulb,
  Moon,
  Sun,
  Target,
  Wind,
  BookOpen,
} as const;

const SEED_TODAY: TodayTask[] = [
  { id: "sun", label: "Morning sunlight", benefit: "Sets your circadian rhythm", duration: 5, done: false, tint: "#FFE7B5", iconKey: "Sun" },
  { id: "water", label: "Drink water", benefit: "500 ml · 2/8", duration: 1, done: false, tint: "#DEE9F1", iconKey: "Droplet" },
  { id: "walk", label: "Walk 20 min", benefit: "Outside · daylight", duration: 20, done: false, tint: "#DDEAE0", iconKey: "Footprints" },
  { id: "phone", label: "No-phone breakfast", benefit: "Slow your morning down", duration: 15, done: false, tint: "#F4C7B0", iconKey: "Coffee" },
  { id: "moon", label: "Bed by 10:30", benefit: "Wind down · dim lights", duration: 1, done: false, tint: "#E5E6F2", iconKey: "Moon" },
];

const TODAY_KEY = "tozumlo.routine.today.v1";

function loadToday(): TodayTask[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TODAY_KEY);
    return raw ? (JSON.parse(raw) as TodayTask[]) : null;
  } catch {
    return null;
  }
}

function persistToday(list: TodayTask[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TODAY_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function blocksToToday(goal: Goal, blocks: Block[]): TodayTask[] {
  return blocks.map((b, i) => ({
    id: `${b.id}-${i}-${Date.now()}`,
    label: b.label,
    benefit: b.benefit,
    duration: b.duration,
    done: false,
    tint: b.tint,
    iconKey: iconKeyFor(b.Icon),
  }));
}

function iconKeyFor(c: ComponentType<{ className?: string }>): keyof typeof ICON_MAP {
  if (c === Bed) return "Bed";
  if (c === Coffee) return "Coffee";
  if (c === Droplet) return "Droplet";
  if (c === Footprints) return "Footprints";
  if (c === Headphones) return "Headphones";
  if (c === Leaf) return "Leaf";
  if (c === Lightbulb) return "Lightbulb";
  if (c === Moon) return "Moon";
  if (c === Sun) return "Sun";
  if (c === Target) return "Target";
  if (c === Wind) return "Wind";
  if (c === BookOpen) return "BookOpen";
  return "Compass";
}

/* ----------------------------- design tokens ----------------------------- */

const TINT = {
  cream: "#FAF6EF",
  card: "#FFFFFF",
  sage: "#D8E7DC",
  sageInk: "#2E4A3A",
  lavender: "#E5E6F2",
  lavenderInk: "#3A3D6B",
  feel: "#EFD8E6",
  feelInk: "#5A3A52",
  warm: "#F8DDC2",
  warmInk: "#6B3514",
  sun: "#FFE7B5",
  sunInk: "#5B4416",
  blue: "#DEE9F1",
  blueInk: "#27506C",
};

const GOALS: Goal[] = [
  {
    id: "sleep",
    label: "Better sleep",
    hint: "Wind down softly",
    tint: TINT.lavender,
    ink: TINT.lavenderInk,
    glow: "rgba(117,121,170,0.40)",
    ambient: "rgba(217,218,238,0.65)",
    Icon: Moon,
  },
  {
    id: "stress",
    label: "Reduce stress",
    hint: "Breathe through it",
    tint: TINT.feel,
    ink: TINT.feelInk,
    glow: "rgba(150,98,140,0.40)",
    ambient: "rgba(234,214,228,0.60)",
    Icon: Wind,
  },
  {
    id: "quiet-mind",
    label: "Quiet the mind",
    hint: "Slow the loop",
    tint: TINT.sage,
    ink: TINT.sageInk,
    glow: "rgba(112,168,144,0.40)",
    ambient: "rgba(216,231,220,0.60)",
    Icon: Leaf,
  },
  {
    id: "focus",
    label: "Deep focus",
    hint: "Settle into work",
    tint: TINT.blue,
    ink: TINT.blueInk,
    glow: "rgba(63,111,176,0.35)",
    ambient: "rgba(217,229,238,0.55)",
    Icon: Brain,
  },
  {
    id: "morning",
    label: "Morning energy",
    hint: "Soft wake-up",
    tint: TINT.sun,
    ink: TINT.sunInk,
    glow: "rgba(245,176,65,0.45)",
    ambient: "rgba(255,224,170,0.55)",
    Icon: Sun,
  },
  {
    id: "reset",
    label: "Emotional reset",
    hint: "Land in yourself",
    tint: TINT.warm,
    ink: TINT.warmInk,
    glow: "rgba(246,154,74,0.40)",
    ambient: "rgba(249,214,189,0.55)",
    Icon: Heart,
  },
];

/* AI-generated routine library, picked per goal */
const LIBRARY: Record<GoalId, Block[]> = {
  sleep: [
    {
      id: "dim",
      label: "Dim the lights",
      duration: 1,
      benefit: "Cues your body that night is starting",
      reasoning: "Your screen time after 9 PM has been higher this week.",
      Icon: Moon,
      tint: TINT.lavender,
    },
    {
      id: "phone",
      label: "Put your phone away",
      duration: 1,
      benefit: "Untangles the mind from notifications",
      reasoning: "Late scrolling correlates with 14 min later sleep onset.",
      Icon: X,
      tint: TINT.feel,
    },
    {
      id: "breath",
      label: "4 · 4 · 6 box breath",
      duration: 4,
      benefit: "Slows mental activity after busy days",
      reasoning: "On nights you breathe first, you fell asleep 22% faster.",
      Icon: Wind,
      tint: TINT.sage,
    },
    {
      id: "tea",
      label: "Chamomile tea",
      duration: 5,
      benefit: "A small, warm ritual to mark the wind-down",
      reasoning: "You've enjoyed this on calm-rated nights before.",
      Icon: Coffee,
      tint: TINT.warm,
    },
    {
      id: "story",
      label: "Sleep story",
      duration: 12,
      benefit: "Drifts you off without screens",
      reasoning: "12-min audio is your average drift time.",
      Icon: Headphones,
      tint: TINT.blue,
    },
  ],
  stress: [
    {
      id: "long-exhale",
      label: "Long exhale breath",
      duration: 2,
      benefit: "Shifts your body to rest mode",
      reasoning: "Your stress trends down after long-exhale sessions.",
      Icon: Wind,
      tint: TINT.feel,
    },
    {
      id: "stretch",
      label: "Soft stretch",
      duration: 4,
      benefit: "Releases held tension in shoulders and jaw",
      reasoning: "You report less tightness on stretch days.",
      Icon: Leaf,
      tint: TINT.sage,
    },
    {
      id: "vent",
      label: "Vent journal",
      duration: 3,
      benefit: "Names the storm so it can pass",
      reasoning: "On vent days your stress drops 18% next morning.",
      Icon: BookOpen,
      tint: TINT.warm,
    },
    {
      id: "ambient",
      label: "Rain ambience",
      duration: 10,
      benefit: "Soft acoustic floor for your nervous system",
      reasoning: "Sound layers reduce mental loops by 30%.",
      Icon: Headphones,
      tint: TINT.blue,
    },
  ],
  "quiet-mind": [
    {
      id: "scan",
      label: "Body scan",
      duration: 6,
      benefit: "Brings attention out of thoughts",
      reasoning: "Your evening loops calm faster after a scan.",
      Icon: Compass,
      tint: TINT.sage,
    },
    {
      id: "grateful",
      label: "Three gratitudes",
      duration: 2,
      benefit: "Reframes what your mind reaches for",
      reasoning: "Gratitude entries lift your weekly mood by ~12%.",
      Icon: BookOpen,
      tint: TINT.sun,
    },
    {
      id: "stillness",
      label: "Two minutes of stillness",
      duration: 2,
      benefit: "A small pause to soften the day",
      reasoning: "Short pauses outperform 20-min meditations for you.",
      Icon: Leaf,
      tint: TINT.lavender,
    },
  ],
  focus: [
    {
      id: "water",
      label: "Drink a glass of water",
      duration: 1,
      benefit: "Sharpens focus before deep work",
      reasoning: "You've been at 2/8 glasses before noon recently.",
      Icon: Droplet,
      tint: TINT.blue,
    },
    {
      id: "intent",
      label: "Set one intention",
      duration: 1,
      benefit: "Anchors attention to a single thread",
      reasoning: "Single-intent sessions doubled your focus score.",
      Icon: Target,
      tint: TINT.sage,
    },
    {
      id: "flow",
      label: "25-min flow tone",
      duration: 25,
      benefit: "Steady cognitive backdrop",
      reasoning: "You stayed in flow longer with low-frequency tones.",
      Icon: Headphones,
      tint: TINT.lavender,
    },
  ],
  morning: [
    {
      id: "sun",
      label: "Morning sunlight",
      duration: 5,
      benefit: "Sets your circadian rhythm",
      reasoning: "Sunlight in the first hour aligns better sleep tonight.",
      Icon: Sun,
      tint: TINT.sun,
    },
    {
      id: "water-am",
      label: "Hydrate first",
      duration: 1,
      benefit: "Wakes your body before caffeine",
      reasoning: "Mornings start smoother on hydrate-first days.",
      Icon: Droplet,
      tint: TINT.blue,
    },
    {
      id: "breath-am",
      label: "10 deep breaths",
      duration: 2,
      benefit: "Soft ramp into the day",
      reasoning: "Replaces the alarm jolt with calm clarity.",
      Icon: Wind,
      tint: TINT.sage,
    },
    {
      id: "intent-am",
      label: "Choose one priority",
      duration: 1,
      benefit: "A single thread to follow today",
      reasoning: "Helps your evening close cleanly.",
      Icon: Target,
      tint: TINT.warm,
    },
  ],
  reset: [
    {
      id: "tea-r",
      label: "Make a warm tea",
      duration: 4,
      benefit: "A grounding pause",
      reasoning: "Your overwhelm score dips after warm rituals.",
      Icon: Coffee,
      tint: TINT.warm,
    },
    {
      id: "ground",
      label: "5-4-3-2-1 grounding",
      duration: 2,
      benefit: "Brings you back into the room",
      reasoning: "You rate calm 4/5 within 5 min of grounding.",
      Icon: Compass,
      tint: TINT.feel,
    },
    {
      id: "letter",
      label: "Write yourself a soft letter",
      duration: 5,
      benefit: "Makes self-compassion concrete",
      reasoning: "Your mood often lifts the next morning after.",
      Icon: BookOpen,
      tint: TINT.lavender,
    },
  ],
};

const ALL_EXTRAS: Block[] = [
  {
    id: "extra-tea",
    label: "Warm tea",
    duration: 5,
    benefit: "A small, warm ritual",
    reasoning: "Suggested whenever the body needs softening.",
    Icon: Coffee,
    tint: TINT.warm,
  },
  {
    id: "extra-stretch",
    label: "Soft stretch",
    duration: 4,
    benefit: "Releases the day from your shoulders",
    reasoning: "Recommended after long sitting hours.",
    Icon: Leaf,
    tint: TINT.sage,
  },
  {
    id: "extra-journal",
    label: "Two-line journal",
    duration: 2,
    benefit: "Closes the loop on the day",
    reasoning: "Improves your morning calm by ~10%.",
    Icon: BookOpen,
    tint: TINT.sun,
  },
  {
    id: "extra-walk",
    label: "Slow indoor walk",
    duration: 5,
    benefit: "Light movement lowers stress",
    reasoning: "Your cortisol dips faster with movement.",
    Icon: Footprints,
    tint: TINT.blue,
  },
];

/* ------------------------------- component ------------------------------- */

export default function RoutineScreen() {
  const { ink, muted } = useTheme();
  const [stage, setStage] = useState<Stage>("today");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [today, setToday] = useState<TodayTask[]>(SEED_TODAY);

  // hydrate today list once on mount
  useEffect(() => {
    const stored = loadToday();
    if (stored && stored.length) setToday(stored);
  }, []);

  // persist whenever today changes
  useEffect(() => {
    persistToday(today);
  }, [today]);

  function chooseGoal(g: Goal) {
    setGoal(g);
    setBlocks(LIBRARY[g.id]);
    window.setTimeout(() => setStage("build"), 480);
  }

  function saveAsToday(g: Goal, b: Block[]) {
    setToday(blocksToToday(g, b));
    setStage("today");
  }

  function toggleTask(id: string) {
    setToday((arr) =>
      arr.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function resetToday() {
    setToday(SEED_TODAY.map((t) => ({ ...t, done: false })));
  }

  return (
    <div className="relative min-h-full">
      {/* ambient adaptive wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          background: goal
            ? `radial-gradient(140% 80% at 50% 0%, ${goal.ambient} 0%, rgba(250,246,239,0) 65%)`
            : "radial-gradient(140% 80% at 50% 0%, rgba(232,224,201,0.4) 0%, rgba(250,246,239,0) 65%)",
        }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <AnimatePresence mode="wait">
        {stage === "today" && (
          <motion.div
            key="today"
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <TodayStage
              tasks={today}
              onToggle={toggleTask}
              onPlan={() => setStage("intent")}
              onReset={resetToday}
              ink={ink}
              muted={muted}
            />
          </motion.div>
        )}

        {stage === "intent" && (
          <motion.div
            key="intent"
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <IntentStage
              onChoose={chooseGoal}
              onBack={() => setStage("today")}
              selected={goal?.id}
              ink={ink}
              muted={muted}
            />
          </motion.div>
        )}

        {stage === "build" && goal && (
          <motion.div
            key="build"
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <BuildStage
              goal={goal}
              blocks={blocks}
              setBlocks={setBlocks}
              onBack={() => setStage("intent")}
              onStart={() => setStage("execute")}
              onSaveAsToday={() => saveAsToday(goal, blocks)}
              ink={ink}
              muted={muted}
            />
          </motion.div>
        )}

        {stage === "execute" && goal && (
          <motion.div
            key="execute"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ExecuteStage
              goal={goal}
              blocks={blocks}
              onExit={() => setStage("build")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================== STAGE 1: INTENT ============================== */

function IntentStage({
  onChoose,
  onBack,
  selected,
  ink,
  muted,
}: {
  onChoose: (g: Goal) => void;
  onBack: () => void;
  selected?: GoalId;
  ink: string;
  muted: string;
}) {
  return (
    <ScreenShell>
      <motion.button
        variants={item}
        whileTap={{ scale: 0.97 }}
        onClick={onBack}
        className="mt-1 flex w-fit items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
        style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Today
      </motion.button>

      <motion.div variants={item} className="mt-3">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color: muted }}
        >
          Routine builder · Lumi
        </p>
        <h1
          className="mt-1 text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em]"
          style={{ color: ink }}
        >
          What kind of evening
          <br />
          do you need?
        </h1>
        <p className="mt-2 text-[12.5px] font-medium" style={{ color: muted }}>
          Choose one and I'll quietly arrange the rest.
        </p>
      </motion.div>

      <motion.div variants={item} className="mt-5 grid grid-cols-2 gap-3">
        {GOALS.map((g) => {
          const isActive = selected === g.id;
          return (
            <motion.button
              key={g.id}
              onClick={() => onChoose(g)}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: isActive ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className="relative overflow-hidden rounded-[22px] border-2 border-zinc-900 p-3 text-left"
              style={{
                backgroundColor: g.tint,
                boxShadow: isActive
                  ? "4px 4px 0 0 rgba(24,24,27,0.95)"
                  : "3px 3px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              {/* soft halo on active */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-hidden
                    className="pointer-events-none absolute -inset-2 rounded-[26px] blur-2xl"
                    style={{ backgroundColor: g.glow }}
                  />
                )}
              </AnimatePresence>

              <span
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-zinc-900 bg-white"
                style={{
                  color: g.ink,
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                <g.Icon className="h-4 w-4" />
              </span>
              <p
                className="relative z-10 mt-3 text-[13.5px] font-extrabold leading-tight"
                style={{ color: g.ink }}
              >
                {g.label}
              </p>
              <p
                className="relative z-10 text-[11px] font-medium"
                style={{ color: g.ink, opacity: 0.75 }}
              >
                {g.hint}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div variants={item} className="mt-5 flex items-center gap-2 text-[11px] font-medium" style={{ color: muted }}>
        <Lightbulb className="h-3.5 w-3.5" />
        Crafted from your last 7 days · sleep, mood, and screen time.
      </motion.div>
    </ScreenShell>
  );
}

/* ============================== STAGE 2: BUILD ============================== */

function BuildStage({
  goal,
  blocks,
  setBlocks,
  onBack,
  onStart,
  onSaveAsToday,
  ink,
  muted,
}: {
  goal: Goal;
  blocks: Block[];
  setBlocks: (b: Block[]) => void;
  onBack: () => void;
  onStart: () => void;
  onSaveAsToday: () => void;
  ink: string;
  muted: string;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const totalMin = useMemo(() => blocks.reduce((s, b) => s + b.duration, 0), [blocks]);

  function remove(id: string) {
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  function add(b: Block) {
    setBlocks([...blocks, { ...b, id: `${b.id}-${Date.now()}` }]);
    setShowAdd(false);
  }

  function adjust(id: string, delta: number) {
    setBlocks(
      blocks.map((b) =>
        b.id === id
          ? { ...b, duration: Math.max(1, Math.min(45, b.duration + delta)) }
          : b,
      ),
    );
  }

  return (
    <ScreenShell>
      {/* header */}
      <motion.div variants={item} className="mt-1 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Goal
        </button>
        <span
          className="rounded-full border-2 border-zinc-900 px-3 py-1 text-[11px] font-bold"
          style={{
            backgroundColor: goal.tint,
            color: goal.ink,
            boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          {goal.label} · {totalMin} min
        </span>
      </motion.div>

      <motion.div variants={item} className="mt-3">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color: muted }}
        >
          Crafted ritual
        </p>
        <h1
          className="mt-0.5 text-[22px] font-extrabold leading-tight tracking-[-0.02em]"
          style={{ color: ink }}
        >
          Shape your flow.
          <br />
          Drag, soften, and start.
        </h1>
      </motion.div>

      {/* Adaptive AI insight */}
      <motion.div variants={item} className="mt-3">
        <AdaptiveInsight goal={goal} />
      </motion.div>

      {/* reorderable blocks */}
      <motion.div variants={item} className="mt-4">
        <Reorder.Group
          axis="y"
          values={blocks}
          onReorder={setBlocks}
          className="space-y-2.5"
        >
          {blocks.map((b, i) => (
            <BlockRow
              key={b.id}
              block={b}
              index={i}
              ink={goal.ink}
              onRemove={() => remove(b.id)}
              onAdjust={(d) => adjust(b.id, d)}
            />
          ))}
        </Reorder.Group>

        {/* add ritual */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          onClick={() => setShowAdd(true)}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-zinc-900 bg-white/60 py-2.5 text-[12px] font-bold text-zinc-900 backdrop-blur"
        >
          <Plus className="h-3.5 w-3.5" />
          Add a ritual
        </motion.button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="mt-4 space-y-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          disabled={blocks.length === 0}
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-zinc-900 px-3 py-3 text-[13.5px] font-extrabold tracking-tight text-white disabled:opacity-50"
          style={{
            background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
            boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          Begin tonight's ritual
          <ArrowRight className="h-4 w-4" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          disabled={blocks.length === 0}
          onClick={onSaveAsToday}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-zinc-900 bg-white px-3 py-2.5 text-[12.5px] font-extrabold tracking-tight text-zinc-900 disabled:opacity-50"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Save to Today's list
        </motion.button>
      </motion.div>

      {/* add-ritual sheet */}
      <AnimatePresence>
        {showAdd && (
          <AddRitualSheet
            onClose={() => setShowAdd(false)}
            onAdd={add}
            ink={goal.ink}
          />
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}

function AdaptiveInsight({ goal }: { goal: Goal }) {
  const data = ADAPTIVE_INSIGHTS[goal.id];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % data.observations.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [data]);

  return (
    <div
      className="overflow-hidden rounded-[20px] border-2 border-zinc-900"
      style={{
        backgroundColor: goal.tint,
        boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      <div className="flex items-start gap-2.5 px-3 pb-1 pt-2.5">
        <span
          className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Lightbulb className="h-3.5 w-3.5" />
        </span>
        <div className="leading-snug">
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
            style={{ color: goal.ink }}
          >
            Lumi · adaptive insight
          </p>
          <p
            className="mt-0.5 text-[12.5px] font-extrabold tracking-tight"
            style={{ color: goal.ink }}
          >
            {data.headline}
          </p>
        </div>
      </div>

      {/* rotating observation */}
      <div
        className="mx-3 mb-3 mt-2 rounded-xl border border-white/40 bg-white/55 px-2.5 py-2 backdrop-blur"
        style={{ boxShadow: "inset 0 0 0 1px rgba(24,24,27,0.06)" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: goal.ink, opacity: 0.7 }}
        >
          From your last 7 days
        </p>
        <div className="relative mt-0.5 min-h-[28px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              className="text-[12px] font-medium"
              style={{ color: goal.ink }}
            >
              {data.observations[idx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* observation pips */}
        <div className="mt-2 flex gap-1">
          {data.observations.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === idx ? 16 : 6,
                opacity: i === idx ? 1 : 0.45,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="h-1 rounded-full"
              style={{ backgroundColor: goal.ink }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlockRow({
  block,
  index,
  ink,
  onRemove,
  onAdjust,
}: {
  block: Block;
  index: number;
  ink: string;
  onRemove: () => void;
  onAdjust: (delta: number) => void;
}) {
  const Icon = block.Icon;
  const dragControls = useDragControls();
  const [open, setOpen] = useState(false);

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 18px 30px -12px rgba(0,0,0,0.35)",
        zIndex: 10,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <motion.div
        layout
        className="overflow-hidden rounded-[20px] border-2 border-zinc-900"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
        }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          {/* drag handle */}
          <button
            onPointerDown={(e) => dragControls.start(e)}
            aria-label="Drag"
            className="cursor-grab touch-none text-zinc-400 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900"
            style={{
              backgroundColor: block.tint,
              color: ink,
              boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
            }}
          >
            <Icon className="h-4 w-4" />
          </span>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-1 flex-col items-start text-left leading-tight"
          >
            <p className="text-[13px] font-extrabold text-zinc-900">
              {String(index + 1).padStart(2, "0")} · {block.label}
            </p>
            <p className="text-[10.5px] font-medium text-zinc-600">
              {block.duration} min · {block.benefit}
            </p>
          </button>

          <button
            onClick={onRemove}
            aria-label="Remove"
            className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="overflow-hidden"
            >
              <div
                className="border-t-2 border-zinc-900/10 px-3 py-2.5"
                style={{ backgroundColor: block.tint }}
              >
                <p
                  className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: ink, opacity: 0.85 }}
                >
                  Why this helps
                </p>
                <p
                  className="mt-0.5 text-[12px] font-medium"
                  style={{ color: ink }}
                >
                  {block.reasoning}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: ink, opacity: 0.85 }}
                  >
                    Duration
                  </span>
                  <button
                    onClick={() => onAdjust(-1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-900 bg-white text-[11px] font-bold"
                  >
                    −
                  </button>
                  <span className="min-w-[36px] text-center text-[12px] font-extrabold text-zinc-900">
                    {block.duration} min
                  </span>
                  <button
                    onClick={() => onAdjust(1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-900 bg-white text-[11px] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
}

function AddRitualSheet({
  onClose,
  onAdd,
  ink,
}: {
  onClose: () => void;
  onAdd: (b: Block) => void;
  ink: string;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="absolute inset-x-0 bottom-0 z-40 rounded-t-[28px] border-2 border-zinc-900 bg-[#FAF6EF] p-4 pb-7"
        style={{ boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.35)" }}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300" />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px] font-extrabold tracking-tight text-zinc-900">
            Add a ritual
          </p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1 text-[11.5px] font-medium text-zinc-600">
          Lumi suggests these for the rhythm you've chosen.
        </p>

        <div className="mt-3 space-y-2">
          {ALL_EXTRAS.map((b) => (
            <motion.button
              key={b.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={() => onAdd(b)}
              className="flex w-full items-center gap-2.5 rounded-2xl border-2 border-zinc-900 bg-white px-3 py-2.5 text-left"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900"
                style={{
                  backgroundColor: b.tint,
                  color: ink,
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                <b.Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-[13px] font-extrabold text-zinc-900">{b.label}</p>
                <p className="text-[10.5px] text-zinc-600">{b.duration} min · {b.benefit}</p>
              </div>
              <Plus className="h-4 w-4 text-zinc-700" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

const ADAPTIVE_INSIGHTS: Record<
  GoalId,
  { headline: string; observations: string[] }
> = {
  sleep: {
    headline: "Your recovery improves when journaling is included.",
    observations: [
      "Sleep onset is 14 min faster on phone-away nights.",
      "Restorative nights cluster after a 4·4·6 box breath.",
      "You drift sooner with a 12-min sleep story than with music.",
    ],
  },
  stress: {
    headline: "You unwind 22% faster after a long-exhale breath.",
    observations: [
      "Stress trends down on days you stretch in the evening.",
      "Vent journaling drops next-morning tension by ~18%.",
      "Rain ambience shortens your loops by about 3 min.",
    ],
  },
  "quiet-mind": {
    headline: "Two-minute pauses outperform longer meditations for you.",
    observations: [
      "Body scans calm your evening loops fastest.",
      "Three-line gratitude lifts your weekly mood by ~12%.",
      "You re-enter focus quicker after a stillness break.",
    ],
  },
  focus: {
    headline: "Single-intent sessions doubled your focus this week.",
    observations: [
      "Hydrating first beats a coffee-first start for you.",
      "Low-frequency tones extend flow by 9 min on average.",
      "You stay focused longer when sessions are 25 min, not 50.",
    ],
  },
  morning: {
    headline: "Sunlight in the first hour aligns with deeper sleep.",
    observations: [
      "Hydrate-first mornings begin smoother than coffee-first ones.",
      "Ten deep breaths replace the alarm jolt without snooze.",
      "Picking one priority closes your evening cleanly.",
    ],
  },
  reset: {
    headline: "A warm ritual + soft letter lifts your next-morning mood.",
    observations: [
      "Your overwhelm score dips fastest after warm rituals.",
      "Grounding within 5 minutes brings calm back at 4/5.",
      "Self-letters tend to lift your mood the next morning.",
    ],
  },
};

/* ============================== STAGE 3: EXECUTE ============================== */

function ExecuteStage({
  goal,
  blocks,
  onExit,
}: {
  goal: Goal;
  blocks: Block[];
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState((blocks[0]?.duration ?? 1) * 60);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  const current = blocks[step];

  // when step changes, reset timer
  useEffect(() => {
    if (!current) return;
    setSecondsLeft(current.duration * 60);
  }, [step, current]);

  // tick
  useEffect(() => {
    if (paused || done || !current) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          // advance
          window.setTimeout(() => {
            if (step >= blocks.length - 1) setDone(true);
            else setStep((i) => i + 1);
          }, 250);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [step, paused, done, current, blocks.length]);

  const total = (current?.duration ?? 1) * 60;
  const progress = current ? 1 - secondsLeft / total : 1;

  const cue = useMemo(() => cueFor(current?.id, progress), [current, progress]);

  return (
    <div className="relative h-full">
      {/* immersive ambient */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            `radial-gradient(80% 60% at 50% 30%, ${goal.glow}, transparent 70%)`,
            `radial-gradient(80% 60% at 50% 50%, ${goal.glow}, transparent 70%)`,
            `radial-gradient(80% 60% at 50% 30%, ${goal.glow}, transparent 70%)`,
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${goal.tint} 0%, rgba(250,246,239,0) 70%)`,
          opacity: 0.85,
        }}
      />

      <div className="relative flex h-full flex-col px-5 pt-2 pb-8">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Exit
          </button>
          <div className="flex items-center gap-2">
            <AmbientPicker ink={goal.ink} tint={goal.tint} />
            <span
              className="rounded-full border-2 border-zinc-900 bg-white px-3 py-1 text-[11px] font-bold text-zinc-900"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              {Math.min(step + 1, blocks.length)} / {blocks.length}
            </span>
          </div>
        </div>

        {/* progress segments */}
        <div className="mt-3 flex gap-1.5">
          {blocks.map((b, i) => {
            const filled = i < step ? 1 : i === step ? progress : 0;
            return (
              <div
                key={b.id}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/50"
                style={{ boxShadow: "inset 0 0 0 1px rgba(24,24,27,0.10)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${goal.ink}, ${goal.ink})` }}
                  animate={{ width: `${filled * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            );
          })}
        </div>

        {/* main */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {!done && current ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + step}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="flex flex-col items-center"
              >
                {/* breathing orb */}
                <motion.div
                  animate={{ scale: paused ? 1 : [1, 1.08, 1] }}
                  transition={{
                    duration: 6,
                    repeat: paused ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full border-2 border-zinc-900"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${goal.tint})`,
                    boxShadow: "4px 4px 0 0 rgba(24,24,27,0.95)",
                    color: goal.ink,
                  }}
                >
                  <current.Icon className="h-7 w-7" />
                </motion.div>

                <p
                  className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: goal.ink, opacity: 0.85 }}
                >
                  {String(step + 1).padStart(2, "0")} of {String(blocks.length).padStart(2, "0")}
                </p>
                <h2 className="mt-1 text-[24px] font-extrabold leading-tight tracking-tight text-zinc-900">
                  {current.label}
                </h2>
                <p
                  className="mt-1 text-[13px] font-medium"
                  style={{ color: "#3F3A36" }}
                >
                  {cue}
                </p>

                <p className="mt-5 text-[36px] font-extrabold tracking-tight text-zinc-900 tabular-nums">
                  {fmt(secondsLeft)}
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span
                className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-zinc-900"
                style={{
                  background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                  boxShadow: "4px 4px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                <Heart className="h-8 w-8 text-white" />
              </span>
              <h2 className="mt-5 text-[22px] font-extrabold leading-tight tracking-tight text-zinc-900">
                You closed the day softly.
              </h2>
              <p className="mt-1 text-[13px] font-medium text-[#3F3A36]">
                I'll log tonight as a calm-rated session.
              </p>
            </motion.div>
          )}
        </div>

        {/* controls */}
        <div className="flex items-center justify-center gap-3">
          {!done && (
            <>
              <button
                onClick={() => setStep((i) => Math.max(0, i - 1))}
                disabled={step === 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-zinc-900 bg-white disabled:opacity-40"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setPaused((p) => !p)}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-900 text-white"
                style={{
                  background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                  boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
                }}
                aria-label={paused ? "Resume" : "Pause"}
              >
                {paused ? (
                  <Play className="h-5 w-5" />
                ) : (
                  <Pause className="h-5 w-5" />
                )}
              </motion.button>
              <button
                onClick={() => {
                  if (step >= blocks.length - 1) setDone(true);
                  else setStep((i) => i + 1);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                aria-label="Next"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
          {done && (
            <button
              onClick={onExit}
              className="rounded-full border-2 border-zinc-900 bg-white px-5 py-2.5 text-[12px] font-extrabold text-zinc-900"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              Back to my routine
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ambient soundscape picker for execute mode */
function AmbientPicker({ ink, tint }: { ink: string; tint: string }) {
  const SOUNDS = [
    { id: "off", label: "Quiet" },
    { id: "rain", label: "Rain" },
    { id: "ocean", label: "Ocean" },
    { id: "forest", label: "Forest" },
  ];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("rain");
  const current = SOUNDS.find((s) => s.id === active) ?? SOUNDS[0];

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-900"
        style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
      >
        <Headphones className="h-3.5 w-3.5" />
        {current.label}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute right-0 top-full z-30 mt-2 rounded-2xl border-2 border-zinc-900 bg-white p-1.5"
            style={{ boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)" }}
          >
            <div className="flex flex-col gap-1">
              {SOUNDS.map((s) => {
                const on = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActive(s.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11.5px] font-bold"
                    style={{
                      backgroundColor: on ? tint : "transparent",
                      color: on ? ink : "#1B1B1B",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: on ? ink : "rgba(24,24,27,0.25)" }}
                    />
                    {s.label}
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

function cueFor(id: string | undefined, progress: number) {
  if (!id) return "Let's begin.";
  if (progress < 0.25) return "Take a slow breath. We're settling in.";
  if (progress < 0.55) return "Your evening is slowing down.";
  if (progress < 0.85) return "Stay with it. Soft and steady.";
  return "Almost there. Let's disconnect gently.";
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/* unused symbol guard */
void Flame;


/* ============================== STAGE 0: TODAY ============================== */

function TodayStage({
  tasks,
  onToggle,
  onPlan,
  onReset,
  ink,
  muted,
}: {
  tasks: TodayTask[];
  onToggle: (id: string) => void;
  onPlan: () => void;
  onReset: () => void;
  ink: string;
  muted: string;
}) {
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const totalMin = tasks.reduce((s, t) => s + t.duration, 0);

  return (
    <ScreenShell>
      {/* header */}
      <motion.div
        variants={item}
        className="mt-1 flex items-center justify-between"
      >
        <div className="leading-tight">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: muted }}
          >
            Today's rituals
          </p>
          <p className="text-[20px] font-extrabold tracking-tight" style={{ color: ink }}>
            Routine
          </p>
        </div>
        <div
          className="rounded-full border-2 border-zinc-900 bg-white px-3 py-1 text-[11px] font-bold text-zinc-900"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Flame className="-mt-0.5 mr-1 inline h-3 w-3" /> 9 day streak
        </div>
      </motion.div>

      {/* progress + minutes */}
      <motion.div variants={item} className="mt-3 grid grid-cols-2 gap-3">
        <div
          className="rounded-[20px] border-2 border-zinc-900 p-3"
          style={{
            backgroundColor: "#D8E7DC",
            boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-700">
            Done
          </p>
          <p className="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight text-zinc-900">
            {done}
            <span className="text-[12px] font-bold">/{total}</span>
          </p>
          <div className="mt-2 flex gap-1">
            {tasks.map((_, i) => (
              <span
                key={i}
                className="h-2.5 flex-1 rounded-full border-2 border-zinc-900"
                style={{
                  backgroundColor: i < done ? "#3F8B7C" : "#fff",
                }}
              />
            ))}
          </div>
        </div>
        <div
          className="rounded-[20px] border-2 border-zinc-900 p-3"
          style={{
            backgroundColor: "#FFE7B5",
            boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-700">
            Today
          </p>
          <p className="mt-0.5 text-[22px] font-extrabold leading-none tracking-tight text-zinc-900">
            {totalMin} <span className="text-[12px] font-bold">min total</span>
          </p>
          <p className="mt-1 text-[10.5px] text-zinc-700">
            {total} ritual{total === 1 ? "" : "s"} on your list
          </p>
        </div>
      </motion.div>

      {/* task list */}
      <motion.div variants={item} className="mt-4 space-y-2.5">
        {tasks.map((t) => {
          const Icon = ICON_MAP[t.iconKey] ?? Compass;
          return (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(t.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onToggle(t.id);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-[20px] border-2 border-zinc-900 p-2.5"
              style={{
                backgroundColor: t.tint,
                boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 leading-tight">
                <p
                  className="text-[13px] font-bold text-zinc-900"
                  style={{ textDecoration: t.done ? "line-through" : "none" }}
                >
                  {t.label}
                </p>
                <p className="text-[10.5px] text-zinc-700">
                  {t.duration} min · {t.benefit}
                </p>
              </div>
              <motion.span
                animate={{ scale: t.done ? 1 : 0.95 }}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900"
                style={{
                  backgroundColor: t.done ? "#003F54" : "#fff",
                  color: t.done ? "#fff" : "#18181B",
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                {t.done && <Check className="h-3.5 w-3.5" />}
              </motion.span>
            </div>
          );
        })}
      </motion.div>

      {/* actions */}
      <motion.div variants={item} className="mt-4 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          onClick={onPlan}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-zinc-900 px-3 py-3 text-[13px] font-extrabold tracking-tight text-white"
          style={{
            background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
            boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          <Plus className="h-4 w-4" />
          Plan a new ritual
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -1 }}
          onClick={onReset}
          aria-label="Reset today"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </ScreenShell>
  );
}
