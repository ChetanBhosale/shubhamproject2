"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Heart, RefreshCw, Sparkles } from "lucide-react";

/* ----------------------------- conversation ----------------------------- */

type Theme = "rest" | "mind" | "feelings" | "screen" | "energy" | "rhythm";

type Step = {
  id: string;
  theme: Theme;
  caption: string;       // soft progress copy
  prompt: string;        // human, warm
  yesLabel: string;
  noLabel: string;
};

const STEPS: Step[] = [
  {
    id: "rest",
    theme: "rest",
    caption: "Let's understand your night a little better",
    prompt: "How has rest been feeling lately?",
    yesLabel: "Restful",
    noLabel: "Restless",
  },
  {
    id: "mind",
    theme: "mind",
    caption: "Just a few gentle check-ins",
    prompt: "Has your mind been busy recently?",
    yesLabel: "A lot",
    noLabel: "Not really",
  },
  {
    id: "calm",
    theme: "feelings",
    caption: "Listening, no judgment",
    prompt: "Have you found small moments of calm today?",
    yesLabel: "Yes, a few",
    noLabel: "Not yet",
  },
  {
    id: "screen",
    theme: "screen",
    caption: "Your sleep rhythm is taking shape",
    prompt: "Have screens been keeping you up late?",
    yesLabel: "Yes",
    noLabel: "Not really",
  },
  {
    id: "exhaust",
    theme: "feelings",
    caption: "Almost there, breathe with me",
    prompt: "Have you felt emotionally drained this week?",
    yesLabel: "A little",
    noLabel: "Holding up",
  },
  {
    id: "energy",
    theme: "energy",
    caption: "Mapping your energy gently",
    prompt: "Do mornings feel restorative lately?",
    yesLabel: "Mostly",
    noLabel: "Heavy",
  },
  {
    id: "bedtime",
    theme: "rhythm",
    caption: "Building tonight's recovery plan",
    prompt: "Has your bedtime been roughly the same each night?",
    yesLabel: "Pretty steady",
    noLabel: "All over",
  },
  {
    id: "calm-now",
    theme: "feelings",
    caption: "One last soft check-in",
    prompt: "Do you feel a sense of calm right now?",
    yesLabel: "Settling",
    noLabel: "Tense",
  },
];

/* Each theme paints a soft ambient wash that adapts as the user moves through. */
const THEMES: Record<
  Theme,
  { wash: string; tint: string; ink: string; halo: string }
> = {
  rest:     { wash: "rgba(217,218,238,0.65)", tint: "#E5E6F2", ink: "#3A3D6B", halo: "rgba(117,121,170,0.35)" },
  mind:     { wash: "rgba(216,231,220,0.60)", tint: "#DDEAE0", ink: "#2E4A3A", halo: "rgba(112,168,144,0.35)" },
  feelings: { wash: "rgba(234,214,228,0.60)", tint: "#EFD8E6", ink: "#5A3A52", halo: "rgba(150,98,140,0.35)" },
  screen:   { wash: "rgba(217,229,238,0.60)", tint: "#DEE9F1", ink: "#27506C", halo: "rgba(63,111,176,0.32)" },
  energy:   { wash: "rgba(249,224,200,0.60)", tint: "#F8DDC2", ink: "#6B3514", halo: "rgba(246,154,74,0.40)" },
  rhythm:   { wash: "rgba(232,224,201,0.60)", tint: "#EDE3CD", ink: "#4A4541", halo: "rgba(120,108,80,0.30)" },
};

/* ----------------------------- main component ----------------------------- */

type Answer = "yes" | "no";

export default function WellnessCheckIn() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState(false);

  const step = STEPS[index];
  const theme = THEMES[step?.theme ?? "rest"];
  const progress = (index + (done ? 1 : 0)) / STEPS.length;

  function answer(value: Answer) {
    setAnswers((a) => ({ ...a, [step.id]: value }));
    // brief pause so the selection feels acknowledged before moving
    window.setTimeout(() => {
      if (index >= STEPS.length - 1) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 380);
  }

  function reset() {
    setIndex(0);
    setAnswers({});
    setDone(false);
  }

  return (
    <div className="relative">
      {/* ambient adaptive wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-3 -top-3 -z-10 h-full rounded-[26px] blur-2xl"
        animate={{ backgroundColor: theme.wash }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <div
        className="relative overflow-hidden rounded-[22px] border-2 border-zinc-900 p-4"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
        }}
      >
        {/* breathing tinted halo behind content */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          animate={{
            background: [
              `radial-gradient(120% 80% at 80% 0%, ${theme.halo}, transparent 60%)`,
              `radial-gradient(120% 80% at 50% 0%, ${theme.halo}, transparent 60%)`,
              `radial-gradient(120% 80% at 80% 0%, ${theme.halo}, transparent 60%)`,
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900"
              style={{
                backgroundColor: theme.tint,
                color: theme.ink,
                boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-700">
              Lumi · gentle check-in
            </p>
          </div>
          {!done && (
            <p className="text-[10.5px] font-semibold text-zinc-500">
              {Math.round(progress * 100)}%
            </p>
          )}
        </div>

        {/* progress dots */}
        <div className="relative z-10 mt-3 flex gap-1.5">
          {STEPS.map((s, i) => {
            const reached = i < index || done;
            const current = i === index && !done;
            return (
              <motion.span
                key={s.id}
                layout
                animate={{
                  flex: current ? 2.2 : 1,
                  backgroundColor: reached
                    ? theme.ink
                    : current
                    ? "#1B1B1B"
                    : "#E7E2D5",
                }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
                className="h-1.5 rounded-full"
              />
            );
          })}
        </div>

        {/* body */}
        <div className="relative z-10 mt-4 min-h-[150px]">
          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: theme.ink, opacity: 0.75 }}
                >
                  {step.caption}
                </p>
                <h3
                  className="mt-2 text-[20px] font-extrabold leading-[1.2] tracking-tight"
                  style={{ color: "#1B1B1B" }}
                >
                  {step.prompt}
                </h3>

                <div className="mt-4 flex gap-2.5">
                  <ChoiceButton
                    label={step.yesLabel}
                    value="yes"
                    selected={answers[step.id] === "yes"}
                    tint={theme.tint}
                    ink={theme.ink}
                    onClick={() => answer("yes")}
                  />
                  <ChoiceButton
                    label={step.noLabel}
                    value="no"
                    selected={answers[step.id] === "no"}
                    tint={theme.tint}
                    ink={theme.ink}
                    onClick={() => answer("no")}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                <Summary answers={answers} onReset={reset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ pieces ------------------------------ */

function ChoiceButton({
  label,
  value,
  selected,
  tint,
  ink,
  onClick,
}: {
  label: string;
  value: Answer;
  selected: boolean;
  tint: string;
  ink: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      className="relative flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-full border-2 border-zinc-900 px-3 py-2.5 text-[13px] font-bold tracking-tight"
      style={{
        backgroundColor: selected ? tint : "#FFFFFF",
        color: selected ? ink : "#1B1B1B",
        boxShadow: selected
          ? "3px 3px 0 0 rgba(24,24,27,0.95)"
          : "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      {/* selected ripple */}
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute h-6 w-6 rounded-full"
            style={{ backgroundColor: ink, opacity: 0.18 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
      <span
        className="relative z-10 text-[10px] font-semibold opacity-60"
      >
        {value === "yes" ? "·" : ""}
      </span>
    </motion.button>
  );
}

function Summary({
  answers,
  onReset,
}: {
  answers: Record<string, Answer>;
  onReset: () => void;
}) {
  const insight = useMemo(() => buildInsight(answers), [answers]);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
        Your check-in is shaping tonight
      </p>
      <h3 className="mt-1 text-[20px] font-extrabold leading-[1.2] tracking-tight text-zinc-900">
        {insight.headline}
      </h3>

      <p className="mt-2 text-[12.5px] font-medium text-zinc-700">
        {insight.body}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Score label="Recovery" value={insight.recovery} ink={insight.ink} tint={insight.tint} />
        <Score label="Mind" value={insight.mind} ink={insight.ink} tint={insight.tint} />
        <Score label="Energy" value={insight.energy} ink={insight.ink} tint={insight.tint} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full border-2 border-zinc-900 bg-white px-3 py-2 text-[11.5px] font-bold text-zinc-900"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.4} />
          Re-check in
        </button>
        <button
          className="ml-auto flex items-center gap-1.5 rounded-full border-2 border-zinc-900 px-3 py-2 text-[11.5px] font-bold text-white"
          style={{
            background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
            boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
          }}
        >
          <Heart className="h-3.5 w-3.5" strokeWidth={2.4} />
          Begin tonight's plan
        </button>
      </div>
    </div>
  );
}

function Score({
  label,
  value,
  tint,
  ink,
}: {
  label: string;
  value: number;
  tint: string;
  ink: string;
}) {
  return (
    <div
      className="rounded-2xl border-2 border-zinc-900 px-2.5 py-2"
      style={{
        backgroundColor: tint,
        boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: ink, opacity: 0.85 }}>
        {label}
      </p>
      <p className="mt-0.5 text-[18px] font-extrabold leading-none tracking-tight text-zinc-900">
        {value}
      </p>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/70">
        <motion.span
          className="block h-full rounded-full"
          style={{ backgroundColor: ink }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* simple, opinionated scoring so the summary feels personal */
function buildInsight(answers: Record<string, Answer>) {
  const a = (k: string) => answers[k];

  // higher = better
  const recovery =
    base() +
    bump(a("rest") === "yes", 18) +
    bump(a("energy") === "yes", 14) +
    bump(a("bedtime") === "yes", 10) -
    bump(a("screen") === "yes", 8);

  const mind =
    base() +
    bump(a("calm") === "yes", 14) +
    bump(a("calm-now") === "yes", 16) -
    bump(a("mind") === "yes", 12) -
    bump(a("exhaust") === "yes", 10);

  const energy =
    base() +
    bump(a("energy") === "yes", 18) +
    bump(a("rest") === "yes", 10) -
    bump(a("exhaust") === "yes", 12) -
    bump(a("screen") === "yes", 6);

  const avg = Math.round((recovery + mind + energy) / 3);

  let headline = "Tonight will be a soft landing.";
  let body =
    "Your answers paint a steady picture. Lumi is gently cueing a calm wind-down with low light and a 12-min sleep story.";
  let tint = THEMES.rest.tint;
  let ink = THEMES.rest.ink;

  if (avg < 50) {
    headline = "You've been carrying a lot. Let's set it down.";
    body =
      "I'll lean into longer exhales, a 5-4-3-2-1 grounding, and dim the room earlier tonight. We'll go slow.";
    tint = THEMES.feelings.tint;
    ink = THEMES.feelings.ink;
  } else if (avg < 70) {
    headline = "There's a gentle wave to ride tonight.";
    body =
      "I'll cue a 4·4·6 box breath and ambient rain. Your bedtime stays close to last night to keep the rhythm steady.";
    tint = THEMES.mind.tint;
    ink = THEMES.mind.ink;
  } else {
    headline = "You're already finding your rhythm.";
    body =
      "I'll keep tonight light: a quick gratitude note, soft playlist, and a 10:30 wind-down nudge.";
    tint = THEMES.energy.tint;
    ink = THEMES.energy.ink;
  }

  return {
    recovery: clamp(recovery),
    mind: clamp(mind),
    energy: clamp(energy),
    headline,
    body,
    tint,
    ink,
  };
}

function base() {
  return 60;
}
function bump(cond: boolean, n: number) {
  return cond ? n : 0;
}
function clamp(n: number) {
  return Math.max(8, Math.min(98, Math.round(n)));
}
