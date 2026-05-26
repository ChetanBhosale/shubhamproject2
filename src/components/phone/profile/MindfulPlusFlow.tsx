"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bed,
  BookOpen,
  Brain,
  ChatCircleDots,
  Compass,
  Headphones,
  Heart,
  Lightbulb,
} from "../icons";
import { COLORS } from "../ui";
import { FlowShell } from "./RemindersFlow";

const FEATURES = [
  {
    label: "Premium sleep journeys",
    sub: "Multi-night programs that adapt to your rhythm.",
    Icon: Bed,
    bg: COLORS.lavender,
    ink: "#3A3D6B",
  },
  {
    label: "AI emotional insights",
    sub: "Daily patterns gently surfaced by Lumi.",
    Icon: Lightbulb,
    bg: COLORS.butter,
    ink: "#5B4416",
  },
  {
    label: "Guided recovery programs",
    sub: "Burnout, anxiety, and reset arcs over weeks.",
    Icon: Compass,
    bg: COLORS.sage,
    ink: "#2E4A3A",
  },
  {
    label: "Advanced analytics",
    sub: "Mood, sleep, and stress correlations.",
    Icon: Brain,
    bg: COLORS.blue,
    ink: "#27506C",
  },
  {
    label: "Deeper journaling",
    sub: "Lumi reflects on themes across your entries.",
    Icon: BookOpen,
    bg: COLORS.peachSoft,
    ink: "#7A4534",
  },
  {
    label: "Wellness soundscapes",
    sub: "Curated drift, focus, and reset audio.",
    Icon: Headphones,
    bg: COLORS.peach,
    ink: "#6B3514",
  },
];

const PLANS: ReadonlyArray<{
  id: "monthly" | "annual";
  title: string;
  price: string;
  sub: string;
  trial: string;
  highlight?: boolean;
}> = [
  { id: "monthly", title: "Monthly", price: "$8.99", sub: "Cancel any time", trial: "" },
  {
    id: "annual",
    title: "Annual",
    price: "$59",
    sub: "Save 45% · ~$4.92 / mo",
    trial: "14-day free trial",
    highlight: true,
  },
];

const QUOTES = [
  "Unlock deeper emotional insights.",
  "Build calmer evenings with AI-guided recovery.",
  "Understand your emotional patterns beautifully.",
];

export default function MindfulPlusFlow({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<"monthly" | "annual">("annual");
  const [stage, setStage] = useState<"browse" | "checkout">("browse");

  return (
    <FlowShell title="Mindful Plus" onClose={onClose}>
      {/* hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.05 }}
        className="relative overflow-hidden rounded-[24px] border-2 border-zinc-900 px-4 py-5"
        style={{
          background:
            "linear-gradient(160deg, #022C3D 0%, #003F54 45%, #0F5973 100%)",
          boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
        }}
      >
        {/* soft glow */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          animate={{
            background: [
              "radial-gradient(60% 60% at 30% 20%, rgba(111,194,176,0.30), transparent 70%)",
              "radial-gradient(60% 60% at 60% 40%, rgba(111,194,176,0.30), transparent 70%)",
              "radial-gradient(60% 60% at 30% 20%, rgba(111,194,176,0.30), transparent 70%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DBCA9]">
            Mindful Plus
          </p>
          <h2 className="mt-1 text-[22px] font-extrabold leading-tight tracking-tight text-white">
            A quieter, more knowing
            <br /> companion.
          </h2>
          <RotatingLine quotes={QUOTES} />
        </div>
      </motion.div>

      {/* feature cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
        }}
        className="mt-4 grid grid-cols-2 gap-2.5"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.label}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 240, damping: 26 },
              },
            }}
            className="rounded-[20px] border-2 border-zinc-900 p-3"
            style={{
              backgroundColor: f.bg,
              boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
            }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <f.Icon className="h-4 w-4" />
            </span>
            <p
              className="mt-2 text-[12.5px] font-extrabold leading-tight"
              style={{ color: f.ink }}
            >
              {f.label}
            </p>
            <p
              className="mt-0.5 text-[10.5px] font-medium"
              style={{ color: f.ink, opacity: 0.85 }}
            >
              {f.sub}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* plans */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {PLANS.map((p) => {
          const on = selected === p.id;
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: on ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={() => setSelected(p.id as typeof selected)}
              className="relative overflow-hidden rounded-[20px] border-2 border-zinc-900 p-3 text-left"
              style={{
                backgroundColor: on ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                boxShadow: on
                  ? "4px 4px 0 0 rgba(24,24,27,0.95)"
                  : "2px 2px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              {p.highlight && (
                <span
                  className="absolute right-2 top-2 rounded-full border border-zinc-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-900"
                  style={{ backgroundColor: COLORS.sage }}
                >
                  Best
                </span>
              )}
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                {p.title}
              </p>
              <p className="mt-0.5 text-[22px] font-extrabold tracking-tight text-zinc-900">
                {p.price}
              </p>
              <p className="text-[10.5px] text-zinc-700">{p.sub}</p>
              {p.trial && (
                <p className="mt-1 text-[10px] font-bold text-[#3F8B7C]">
                  {p.trial}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={() => setStage("checkout")}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-zinc-900 px-3 py-3 text-[14px] font-extrabold tracking-tight text-white"
        style={{
          background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
          boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
        }}
      >
        <Heart className="h-4 w-4" />
        {selected === "annual"
          ? "Begin 14-day free trial"
          : "Continue with Monthly"}
      </motion.button>

      <div className="mt-2 flex items-center justify-between text-[10.5px] text-zinc-600">
        <button className="font-semibold underline-offset-2 hover:underline">
          Restore purchase
        </button>
        <p>Cancel any time · no hidden charges</p>
      </div>

      {stage === "checkout" && (
        <CheckoutSheet
          plan={PLANS.find((p) => p.id === selected)!}
          onClose={() => setStage("browse")}
        />
      )}
    </FlowShell>
  );
}

function RotatingLine({ quotes }: { quotes: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % quotes.length), 4200);
    return () => clearInterval(id);
  }, [quotes.length]);
  return (
    <div className="relative mt-3 min-h-[18px]">
      <motion.p
        key={i}
        initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="text-[12px] font-medium text-[#D8E7DC]"
      >
        {quotes[i]}
      </motion.p>
    </div>
  );
}

function CheckoutSheet({
  plan,
  onClose,
}: {
  plan: (typeof PLANS)[number];
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-40 bg-zinc-900/30 backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] border-2 border-zinc-900 bg-[#FAF6EF] p-5 pb-7"
        style={{ boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.35)" }}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300" />
        {!done ? (
          <>
            <p className="mt-3 text-[13px] font-extrabold tracking-tight text-zinc-900">
              Confirm Mindful Plus · {plan.title}
            </p>
            <p className="mt-1 text-[11.5px] font-medium text-zinc-600">
              {plan.trial ? plan.trial + " · " : ""}{plan.price}
            </p>
            <div className="mt-3 space-y-2">
              <Line icon={<ChatCircleDots className="h-3.5 w-3.5" />} text="Lumi reflects on your weekly themes" />
              <Line icon={<Compass className="h-3.5 w-3.5" />} text="Recovery arcs paced for your rhythm" />
              <Line icon={<Headphones className="h-3.5 w-3.5" />} text="Soundscapes built for your nervous system" />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setDone(true)}
              className="mt-4 w-full rounded-full border-2 border-zinc-900 py-2.5 text-[13px] font-extrabold text-white"
              style={{
                background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              Confirm
            </motion.button>
          </>
        ) : (
          <div className="flex flex-col items-center py-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-900 text-white"
              style={{
                background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              <Heart className="h-5 w-5" weight="fill" />
            </span>
            <p className="mt-2 text-[14px] font-extrabold text-zinc-900">
              You're in. Welcome.
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-600">
              I'll quietly weave the new flows into your evenings.
            </p>
            <button
              onClick={onClose}
              className="mt-3 rounded-full border-2 border-zinc-900 bg-white px-3 py-1.5 text-[11.5px] font-bold text-zinc-900"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

function Line({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-2xl border-2 border-zinc-900 bg-white px-2.5 py-2"
      style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-zinc-900 bg-[#D8E7DC]">
        {icon}
      </span>
      <p className="text-[11.5px] font-semibold text-zinc-900">{text}</p>
    </div>
  );
}
