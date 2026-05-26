"use client";

import { motion } from "framer-motion";
import { COLORS, NeoCard, ScreenShell, item, useTheme } from "../ui";

const ENERGY = [40, 55, 48, 62, 70, 58, 72];
const STRESS = [55, 48, 60, 50, 45, 38, 30];
const SLEEP_HRS = [6.4, 7.1, 5.8, 7.6, 6.9, 8.2, 7.4];

export default function AnalyticsScreen() {
  const { ink, muted } = useTheme();
  return (
    <ScreenShell>
      <motion.div variants={item} className="mt-1">
        <p className="text-[11px]" style={{ color: muted }}>This week</p>
        <h1 className="text-[22px] font-extrabold tracking-tight" style={{ color: ink }}>
          Mood analytics
        </h1>
      </motion.div>

      <motion.div variants={item} className="mt-4 grid grid-cols-2 gap-3">
        <NeoCard bg={COLORS.lavender} padding="p-3">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
            Avg stress
          </p>
          <p className="mt-1 text-[22px] font-extrabold tracking-tight text-zinc-900">Mild</p>
          <p className="mt-0.5 text-[10.5px] text-zinc-700">↓ 18% vs last week</p>
        </NeoCard>
        <NeoCard bg={COLORS.peach} padding="p-3">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
            Burnout risk
          </p>
          <p className="mt-1 text-[22px] font-extrabold tracking-tight text-zinc-900">Low</p>
          <div className="mt-2 flex gap-1">
            {[1, 1, 1, 0, 0].map((v, i) => (
              <span
                key={i}
                className="h-2.5 flex-1 rounded-full border-2 border-zinc-900"
                style={{ backgroundColor: v ? COLORS.warmOrange : "#fff" }}
              />
            ))}
          </div>
        </NeoCard>
      </motion.div>

      <motion.div variants={item} className="mt-3">
        <NeoCard bg={COLORS.mintSoft} padding="p-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
                Energy timeline
              </p>
              <p className="mt-1 text-[18px] font-extrabold tracking-tight text-zinc-900">
                Climbing
              </p>
            </div>
            <p className="text-[10.5px] text-zinc-700">Mon → Sun</p>
          </div>
          <LineChart points={ENERGY} stroke={COLORS.deepOcean} fill="rgba(0,63,84,0.16)" />
        </NeoCard>
      </motion.div>

      <motion.div variants={item} className="mt-3">
        <NeoCard bg="#ffffff" padding="p-3">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
            Sleep vs stress
          </p>
          <div className="mt-2 flex h-[80px] items-end gap-1.5">
            {SLEEP_HRS.map((h, i) => {
              const sleepPct = (h / 9) * 100;
              const stressPct = STRESS[i];
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="relative flex h-16 w-full items-end gap-0.5">
                    <motion.span
                      initial={{ height: 0 }}
                      animate={{ height: `${sleepPct}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 140,
                        damping: 18,
                        delay: 0.3 + i * 0.04,
                      }}
                      className="flex-1 rounded-md border-2 border-zinc-900"
                      style={{ backgroundColor: COLORS.warmOrange }}
                    />
                    <motion.span
                      initial={{ height: 0 }}
                      animate={{ height: `${stressPct}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 140,
                        damping: 18,
                        delay: 0.4 + i * 0.04,
                      }}
                      className="flex-1 rounded-md border-2 border-zinc-900"
                      style={{ backgroundColor: COLORS.lavenderMuted }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-700">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10.5px] font-bold text-zinc-700">
            <Legend color={COLORS.warmOrange} label="Sleep" />
            <Legend color={COLORS.lavenderMuted} label="Stress" />
          </div>
        </NeoCard>
      </motion.div>
    </ScreenShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-3 w-3 rounded-sm border-2 border-zinc-900"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function LineChart({
  points,
  stroke,
  fill,
}: {
  points: number[];
  stroke: string;
  fill: string;
}) {
  const w = 280;
  const h = 70;
  const max = 100;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-[70px] w-full" preserveAspectRatio="none">
      <motion.path
        d={area}
        fill={fill}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <motion.path
        d={path}
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}
