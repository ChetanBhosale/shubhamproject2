"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bed,
  ChevronRight,
  LifeBuoy,
  Moon,
  Smile,
  Users,
} from "../icons";
import {
  COLORS,
  NeoCard,
  ScreenShell,
  item,
  useNav,
  useTheme,
} from "../ui";
import MoodSelector from "../MoodSelector";
import WellnessCheckIn from "../WellnessCheckIn";

const SLEEP_BARS = [55, 70, 45, 80, 60, 90, 50, 75, 40, 85];
const STRESS_BARS = [10, 12, 14, 35, 18, 60, 75, 70, 85, 95];

export default function HomeScreen() {
  const { push } = useNav();
  const { ink, muted } = useTheme();

  return (
    <ScreenShell>
      <motion.div variants={item} className="mt-3 flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=3&w=160&h=160&q=80"
          alt="Alex Miller"
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.25)]"
        />
        <div className="leading-tight">
          <p className="text-[11px]" style={{ color: muted }}>
            Welcome back
          </p>
          <p className="text-[15px] font-bold" style={{ color: ink }}>
            Alex Miller
          </p>
        </div>
      </motion.div>

      <motion.p
        variants={item}
        className="mt-3 text-[12px] font-medium"
        style={{ color: muted }}
      >
        Sep 14, 2025
      </motion.p>

      <motion.h1
        variants={item}
        className="mt-2 text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em]"
        style={{ color: ink }}
      >
        Hello Alex! How are
        <br />
        you feeling today?
      </motion.h1>

      <motion.div variants={item} className="mt-5">
        <MoodSelector />
      </motion.div>

      {/* primary cards */}
      <motion.div variants={item} className="mt-4 grid grid-cols-2 gap-3">
        <NeoCard bg={COLORS.peach} onClick={() => push("sleep")}>
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-900">
            <Bed className="h-3.5 w-3.5" />
            Sleep Duration
          </div>
          <div className="mt-2 flex h-[72px] items-end gap-[3px]">
            {SLEEP_BARS.map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.3 + i * 0.04,
                }}
                className="flex-1 rounded-full"
                style={{ backgroundColor: COLORS.warmOrange }}
              />
            ))}
          </div>
          <p className="mt-2 text-[22px] font-extrabold leading-none tracking-tight text-zinc-900">
            7h 20<span className="text-[14px] font-bold">min</span>
          </p>
        </NeoCard>

        <NeoCard bg={COLORS.lavender} onClick={() => push("analytics")}>
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-900">
            <Smile className="h-3.5 w-3.5" />
            Stress Indicator
          </div>
          <div className="mt-2 flex h-[72px] items-end gap-[3px]">
            {STRESS_BARS.map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: 0.4 + i * 0.04,
                }}
                className="flex-1 rounded-full"
                style={{ backgroundColor: COLORS.lavenderMuted }}
              />
            ))}
          </div>
          <p className="mt-2 text-[22px] font-extrabold leading-none tracking-tight text-zinc-900">
            High
          </p>
        </NeoCard>
      </motion.div>

      {/* conversational check-in */}
      <motion.div variants={item} className="mt-3">
        <WellnessCheckIn />
      </motion.div>

      {/* shortcuts */}
      <motion.div variants={item} className="mt-3 grid grid-cols-2 gap-3">
        <ShortcutCard
          bg={COLORS.sage}
          label="Daily routine"
          sub="2 of 5 done"
          icon={<Activity className="h-4 w-4" />}
          onClick={() => push("routine")}
        />
        <ShortcutCard
          bg={COLORS.blue}
          label="Sleep recovery"
          sub="Score 86 last night"
          icon={<Moon className="h-4 w-4" />}
          onClick={() => push("sleep")}
        />
      </motion.div>

      {/* SOS / community */}
      <motion.div variants={item} className="mt-3 grid grid-cols-2 gap-3">
        <ShortcutCard
          bg={COLORS.rose}
          label="I’m overwhelmed"
          sub="Open calm space"
          icon={<LifeBuoy className="h-4 w-4" />}
          onClick={() => push("calm")}
        />
        <ShortcutCard
          bg={COLORS.lavender}
          label="Circles"
          sub="Anonymous support"
          icon={<Users className="h-4 w-4" />}
          onClick={() => push("community")}
        />
      </motion.div>
    </ScreenShell>
  );
}

function ShortcutCard({
  bg,
  label,
  sub,
  icon,
  onClick,
}: {
  bg: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <NeoCard bg={bg} onClick={onClick}>
      <div className="flex items-start justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          {icon}
        </span>
        <ChevronRight className="h-4 w-4 text-zinc-700" />
      </div>
      <p className="mt-2 text-[13px] font-extrabold leading-tight text-zinc-900">
        {label}
      </p>
      <p className="text-[10.5px] text-zinc-700">{sub}</p>
    </NeoCard>
  );
}
