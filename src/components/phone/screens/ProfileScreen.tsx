"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HeartHandshake,
  LogOut,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import {
  COLORS,
  NeoCard,
  ScreenShell,
  item,
  useNav,
  useTheme,
} from "../ui";

export default function ProfileScreen() {
  const { theme, toggle, ink, muted } = useTheme();
  const { push } = useNav();
  const dark = theme === "dark";

  return (
    <ScreenShell>
      <motion.div variants={item} className="mt-1 flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=3&w=160&h=160&q=80"
          alt="Alex"
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.25)]"
        />
        <div className="leading-tight">
          <p className="text-[16px] font-extrabold" style={{ color: ink }}>
            Alex Miller
          </p>
          <p className="text-[11px]" style={{ color: muted }}>
            Mindful since June 2024
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Streak" value="28" sub="days" bg={COLORS.sage} />
        <Stat label="Sleep" value="86" sub="last night" bg={COLORS.blue} />
        <Stat label="Mood" value="↑" sub="up 12%" bg={COLORS.butter} />
      </motion.div>

      {/* Theme toggle */}
      <motion.div variants={item} className="mt-4">
        <NeoCard bg={dark ? "#0F5973" : "#ffffff"} padding="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900"
                style={{
                  backgroundColor: dark ? COLORS.surface : COLORS.butter,
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                {dark ? (
                  <Sun className="h-4 w-4" strokeWidth={2.4} />
                ) : (
                  <Moon className="h-4 w-4" strokeWidth={2.4} />
                )}
              </span>
              <div className="leading-tight">
                <p className="text-[13px] font-extrabold" style={{ color: ink }}>
                  {dark ? "Light mode" : "Dark mode"}
                </p>
                <p className="text-[10.5px]" style={{ color: muted }}>
                  Match your screen to your mood
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggle}
              className="relative h-7 w-12 rounded-full border-2 border-zinc-900"
              style={{
                backgroundColor: dark ? COLORS.deepOcean : "#fff",
                boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
              }}
            >
              <motion.span
                animate={{ x: dark ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 26 }}
                className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full border-2 border-zinc-900 bg-white"
              />
            </motion.button>
          </div>
        </NeoCard>
      </motion.div>

      <motion.div variants={item} className="mt-3 space-y-2.5">
        <Row
          icon={<HeartHandshake className="h-4 w-4" strokeWidth={2.4} />}
          label="Emergency support"
          sub="Calm space, SOS contacts"
          bg={COLORS.rose}
          onClick={() => push("calm")}
        />
        <Row
          icon={<Users className="h-4 w-4" strokeWidth={2.4} />}
          label="Circles"
          sub="Anonymous community"
          bg={COLORS.lavender}
          onClick={() => push("community")}
        />
        <Row
          icon={<Bell className="h-4 w-4" strokeWidth={2.4} />}
          label="Reminders"
          sub="Routine, journal, sleep"
          bg={COLORS.butter}
        />
        <Row
          icon={<CreditCard className="h-4 w-4" strokeWidth={2.4} />}
          label="Mindful Plus"
          sub="Free trial · 14 days left"
          bg={COLORS.peach}
        />
        <Row
          icon={<LogOut className="h-4 w-4" strokeWidth={2.4} />}
          label="Sign out"
          sub="See you tomorrow"
          bg="#ffffff"
        />
      </motion.div>
    </ScreenShell>
  );
}

function Stat({
  label,
  value,
  sub,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  bg: string;
}) {
  return (
    <NeoCard bg={bg} padding="p-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
        {label}
      </p>
      <p className="mt-0.5 text-[20px] font-extrabold leading-none tracking-tight text-zinc-900">
        {value}
      </p>
      <p className="text-[10px] text-zinc-700">{sub}</p>
    </NeoCard>
  );
}

function Row({
  icon,
  label,
  sub,
  bg,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  bg: string;
  onClick?: () => void;
}) {
  return (
    <NeoCard bg={bg} padding="p-2.5" onClick={onClick}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          {icon}
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-[13px] font-extrabold text-zinc-900">{label}</p>
          <p className="text-[10.5px] text-zinc-700">{sub}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-700" strokeWidth={2.4} />
      </div>
    </NeoCard>
  );
}
