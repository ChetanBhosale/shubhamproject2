"use client";

import { motion } from "framer-motion";
import { Headphones, Moon, Pause, Play, Volume2 } from "lucide-react";
import { useState } from "react";
import { COLORS, NeoCard, ScreenShell, item, useTheme } from "../ui";

const SOUNDS = [
  { l: "Rain", c: COLORS.blue },
  { l: "Forest", c: COLORS.mintSoft },
  { l: "Waves", c: COLORS.lavender },
  { l: "Fireplace", c: COLORS.peachSoft },
];

export default function BreathingScreen() {
  const [playing, setPlaying] = useState(true);
  const [active, setActive] = useState("Rain");
  const { ink, muted } = useTheme();

  return (
    <ScreenShell>
      <motion.div variants={item} className="mt-1 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: muted }}>
          Breathe with me
        </p>
        <h1 className="mt-1 text-[22px] font-extrabold tracking-tight" style={{ color: ink }}>
          4 · 4 · 6 box breath
        </h1>
      </motion.div>

      <motion.div variants={item} className="mt-5 flex justify-center">
        <div className="relative h-[220px] w-[220px]">
          <motion.div
            animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${COLORS.sage}, ${COLORS.mintTeal})`,
              border: "2px solid #18181B",
              boxShadow: "5px 5px 0 0 rgba(24,24,27,0.95)",
            }}
          />
          <motion.div
            animate={playing ? { scale: [0.8, 1, 0.8] } : { scale: 0.85 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 rounded-full bg-white/60 backdrop-blur"
            style={{ border: "2px solid #18181B" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-900">
            <motion.p
              animate={playing ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.6 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-[13px] font-bold uppercase tracking-[0.18em]"
            >
              {playing ? "Breathe in" : "Paused"}
            </motion.p>
            <p className="mt-1 text-[34px] font-extrabold tracking-tight">04:32</p>
            <p className="text-[10px] font-medium">cycle 3 of 8</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-6 flex items-center justify-center gap-3">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Volume2 className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setPlaying((p) => !p)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-900 text-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          {playing ? (
            <Pause className="h-5 w-5" strokeWidth={2.4} />
          ) : (
            <Play className="h-5 w-5" strokeWidth={2.4} />
          )}
        </motion.button>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Headphones className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </motion.div>

      <motion.div variants={item} className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: muted }}>
          Ambient sounds
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {SOUNDS.map((s) => {
            const on = active === s.l;
            return (
              <motion.button
                key={s.l}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActive(s.l)}
                className="rounded-2xl border-2 border-zinc-900 p-2 text-[11px] font-bold text-zinc-900"
                style={{
                  backgroundColor: on ? s.c : "#fff",
                  boxShadow: on
                    ? "2px 2px 0 0 rgba(24,24,27,0.95)"
                    : "1px 1px 0 0 rgba(24,24,27,0.7)",
                }}
              >
                {s.l}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-4">
        <NeoCard bg={COLORS.peach} padding="p-3">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <Moon className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <div className="flex-1 leading-tight">
              <p className="text-[13px] font-bold text-zinc-900">Sleep meditation</p>
              <p className="text-[10.5px] text-zinc-700">Drift · 12 min</p>
            </div>
            <span className="text-[11px] font-bold text-zinc-900">Play</span>
          </div>
        </NeoCard>
      </motion.div>
    </ScreenShell>
  );
}
