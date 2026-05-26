"use client";

import { motion } from "framer-motion";
import { Bed, Music2 } from "lucide-react";
import { useState } from "react";
import { ScreenShell, item } from "../ui";

const NIGHT = "#003F54";
const NIGHT_SOFT = "#0F5973";

const ROUTINE = [
  { l: "Dim the lights", t: "9:30" },
  { l: "Phone in another room", t: "9:45" },
  { l: "Stretch · 5 min", t: "10:00" },
  { l: "Sleep story · 12 min", t: "10:15" },
];

const SOUNDS = [
  { l: "Soft rain", c: "#1A6E84" },
  { l: "Ocean", c: "#003F54" },
  { l: "Sage forest", c: "#5C8478" },
];

export default function SleepScreen() {
  const [active, setActive] = useState("Soft rain");
  return (
    <div className="relative min-h-full">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundColor: NIGHT }}>
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${(i * 53) % 90 + 5}%`,
              left: `${(i * 37) % 92 + 4}%`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              opacity: 0.6,
            }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <ScreenShell>
        <motion.div variants={item} className="mt-1 flex items-center justify-between text-white">
          <div className="leading-tight">
            <p className="text-[11px] opacity-70">Tonight</p>
            <p className="text-[15px] font-extrabold">Sleep recovery</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-4 flex justify-center">
          <div
            className="relative flex h-[170px] w-[170px] items-center justify-center rounded-full border-2 border-white/30"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${NIGHT_SOFT}, #1A6E84)`,
              boxShadow: "0 18px 30px -10px rgba(0,30,45,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div className="text-center text-white">
              <p className="text-[10px] uppercase tracking-[0.16em] opacity-70">Sleep score</p>
              <p className="text-[44px] font-extrabold leading-none tracking-tight">86</p>
              <p className="mt-1 text-[10.5px] opacity-70">restorative · 7h 24m</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">
            Tonight’s wind-down
          </p>
          <div className="mt-2 space-y-2">
            {ROUTINE.map((r, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20"
                  style={{ backgroundColor: NIGHT_SOFT }}
                >
                  <Bed className="h-3.5 w-3.5 text-white/90" strokeWidth={2.4} />
                </span>
                <span className="flex-1 text-[12.5px] font-bold text-white">{r.l}</span>
                <span className="text-[11px] text-white/60">{r.t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">
            White noise
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SOUNDS.map((s) => {
              const on = active === s.l;
              return (
                <motion.button
                  key={s.l}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive(s.l)}
                  className="rounded-2xl border px-2 py-3 text-[11px] font-bold text-white"
                  style={{
                    borderColor: on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                    background: `linear-gradient(180deg, ${s.c}, ${NIGHT_SOFT})`,
                  }}
                >
                  <Music2 className="mx-auto mb-1 h-3.5 w-3.5" strokeWidth={2.4} />
                  {s.l}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-5">
          <button
            className="w-full rounded-full border-2 border-white/40 px-3 py-3 text-[13px] font-extrabold text-zinc-900"
            style={{ backgroundColor: "#FAF6EF" }}
          >
            Begin tonight’s routine
          </button>
        </motion.div>
      </ScreenShell>
    </div>
  );
}
