"use client";

import { motion } from "framer-motion";
import { Check, Coffee, Droplet, Footprints, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { COLORS, NeoCard, ScreenShell, item, useTheme } from "../ui";

const SEED = [
  { id: "sun", icon: Sun, label: "Morning sunlight", time: "7:00 · 5 min", done: true, c: COLORS.butter },
  { id: "water", icon: Droplet, label: "Drink water", time: "500 ml · 2/8", done: true, c: COLORS.blue },
  { id: "coffee", icon: Coffee, label: "No-phone breakfast", time: "7:30", done: false, c: COLORS.peachSoft },
  { id: "walk", icon: Footprints, label: "Walk 20 min", time: "Outside", done: false, c: COLORS.mintSoft },
  { id: "moon", icon: Moon, label: "Bed by 10:30", time: "Wind down", done: false, c: COLORS.lavender },
];

export default function RoutineScreen() {
  const { ink, muted } = useTheme();
  const [tasks, setTasks] = useState(SEED);
  const done = tasks.filter((t) => t.done).length;

  return (
    <ScreenShell>
      <motion.div variants={item} className="mt-1 flex items-center justify-between">
        <div className="leading-tight">
          <p className="text-[11px]" style={{ color: muted }}>Today’s rituals</p>
          <p className="text-[15px] font-extrabold" style={{ color: ink }}>Routine</p>
        </div>
        <div
          className="rounded-full border-2 border-zinc-900 bg-white px-3 py-1 text-[11px] font-bold"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          🔥 9 day streak
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-3 grid grid-cols-2 gap-3">
        <NeoCard bg={COLORS.sage} padding="p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-700">Done</p>
          <p className="mt-1 text-[24px] font-extrabold tracking-tight text-zinc-900">
            {done}<span className="text-[14px] font-bold">/{tasks.length}</span>
          </p>
          <div className="mt-2 flex gap-1">
            {tasks.map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 + i * 0.05 }}
                className="h-2.5 flex-1 rounded-full border-2 border-zinc-900"
                style={{ backgroundColor: i < done ? COLORS.mintTeal : "#fff" }}
              />
            ))}
          </div>
        </NeoCard>
        <NeoCard bg={COLORS.peach} padding="p-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-700">Water</p>
          <p className="mt-1 text-[24px] font-extrabold tracking-tight text-zinc-900">
            2<span className="text-[14px] font-bold">/8</span>
          </p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="h-3 flex-1 rounded-sm border-2 border-zinc-900"
                style={{ backgroundColor: i < 2 ? COLORS.warmOrange : "#fff" }}
              />
            ))}
          </div>
        </NeoCard>
      </motion.div>

      <motion.div variants={item} className="mt-4 space-y-2.5">
        {tasks.map((t) => {
          const Icon = t.icon;
          return (
            <NeoCard
              key={t.id}
              bg={t.c}
              padding="p-2.5"
              onClick={() =>
                setTasks((arr) =>
                  arr.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                )
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white"
                  style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <div className="flex-1 leading-tight">
                  <p
                    className="text-[13px] font-bold text-zinc-900"
                    style={{ textDecoration: t.done ? "line-through" : "none" }}
                  >
                    {t.label}
                  </p>
                  <p className="text-[10.5px] text-zinc-700">{t.time}</p>
                </div>
                <motion.span
                  animate={{ scale: t.done ? 1 : 0.95 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900"
                  style={{
                    backgroundColor: t.done ? COLORS.deepOcean : "#fff",
                    color: t.done ? "#fff" : "#18181B",
                    boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                  }}
                >
                  {t.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </motion.span>
              </div>
            </NeoCard>
          );
        })}
      </motion.div>
    </ScreenShell>
  );
}
