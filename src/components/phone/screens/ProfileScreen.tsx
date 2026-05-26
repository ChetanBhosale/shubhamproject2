"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Bell,
  Camera,
  ChevronRight,
  CreditCard,
  HeartHandshake,
  LogOut,
  Moon,
  Pencil,
  Phone,
  Sun,
  Users,
  X,
} from "../icons";
import {
  COLORS,
  NeoCard,
  ScreenShell,
  item,
  useNav,
  useTheme,
} from "../ui";
import RemindersFlow from "../profile/RemindersFlow";
import MindfulPlusFlow from "../profile/MindfulPlusFlow";
import SignOutFlow from "../profile/SignOutFlow";

type Flow = "reminders" | "plus" | "signout" | null;

export default function ProfileScreen() {
  const { theme, toggle, ink, muted } = useTheme();
  const { push } = useNav();
  const dark = theme === "dark";
  const [flow, setFlow] = useState<Flow>(null);
  const [avatarSheet, setAvatarSheet] = useState(false);

  return (
    <>
    <ScreenShell>
      <motion.div variants={item} className="mt-1 flex items-center gap-3">
        <motion.button
          onClick={() => setAvatarSheet(true)}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          aria-label="Account menu"
          className="relative h-14 w-14 shrink-0"
        >
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=3&w=160&h=160&q=80"
            alt="Alex"
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.25)]"
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
            style={{ boxShadow: "1px 1px 0 0 rgba(24,24,27,0.95)" }}
          >
            <Pencil className="h-2.5 w-2.5" />
          </span>
        </motion.button>
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
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
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
        <EmergencyRow
          onOpen={() => push("calm")}
          onCall={() => push("calm")}
        />
        <Row
          icon={<Users className="h-4 w-4" />}
          label="Circles"
          sub="Anonymous community"
          bg={COLORS.lavender}
          onClick={() => push("community")}
        />
        <Row
          icon={<Bell className="h-4 w-4" />}
          label="Reminders"
          sub="Routine, journal, sleep"
          bg={COLORS.butter}
          onClick={() => setFlow("reminders")}
        />
        <Row
          icon={<CreditCard className="h-4 w-4" />}
          label="Mindful Plus"
          sub="Free trial · 14 days left"
          bg={COLORS.peach}
          onClick={() => setFlow("plus")}
        />
        <Row
          icon={<LogOut className="h-4 w-4" />}
          label="Sign out"
          sub="See you tomorrow"
          bg="#ffffff"
          onClick={() => setFlow("signout")}
        />
      </motion.div>
    </ScreenShell>

    <AnimatePresence>
      {flow === "reminders" && (
        <RemindersFlow key="reminders" onClose={() => setFlow(null)} />
      )}
      {flow === "plus" && (
        <MindfulPlusFlow key="plus" onClose={() => setFlow(null)} />
      )}
      {flow === "signout" && (
        <SignOutFlow key="signout" onClose={() => setFlow(null)} />
      )}
      {avatarSheet && (
        <AvatarSheet
          key="avatar"
          onClose={() => setAvatarSheet(false)}
          onSignOut={() => {
            setAvatarSheet(false);
            setFlow("signout");
          }}
        />
      )}
    </AnimatePresence>
    </>
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
        <ChevronRight className="h-4 w-4 text-zinc-700" />
      </div>
    </NeoCard>
  );
}

function EmergencyRow({
  onOpen,
  onCall,
}: {
  onOpen: () => void;
  onCall: () => void;
}) {
  return (
    <NeoCard bg={COLORS.rose} padding="p-2.5" onClick={onOpen}>
      <div className="flex items-center gap-3">
        <span
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <HeartHandshake className="h-4 w-4" />
          {/* soft pulse halo */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            style={{ border: "2px solid rgba(197,107,63,0.55)" }}
          />
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-[13px] font-extrabold text-zinc-900">
            Emergency support
          </p>
          <p className="text-[10.5px] text-zinc-700">Calm space, SOS contacts</p>
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onCall();
          }}
          whileTap={{ scale: 0.92 }}
          aria-label="Call trusted contact"
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          <Phone className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </NeoCard>
  );
}

function AvatarSheet({
  onClose,
  onSignOut,
}: {
  onClose: () => void;
  onSignOut: () => void;
}) {
  const items: { icon: React.ReactNode; label: string; sub: string; onClick?: () => void }[] = [
    {
      icon: <Pencil className="h-4 w-4" />,
      label: "Edit profile",
      sub: "Name, bio, mindful since",
    },
    {
      icon: <Camera className="h-4 w-4" />,
      label: "Change photo",
      sub: "Upload or pick from library",
    },
    {
      icon: <HeartHandshake className="h-4 w-4" />,
      label: "Wellness status",
      sub: "Calm · open to gentle nudges",
    },
    {
      icon: <Bell className="h-4 w-4" />,
      label: "Account preferences",
      sub: "Email, language, region",
    },
    {
      icon: <LogOut className="h-4 w-4" />,
      label: "Sign out",
      sub: "Take a soft pause",
      onClick: onSignOut,
    },
  ];

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
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] border-2 border-zinc-900 bg-[#FAF6EF] p-4 pb-7"
        style={{ boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.35)" }}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300" />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[14px] font-extrabold tracking-tight text-zinc-900">
            Account
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {items.map((it, i) => (
            <motion.button
              key={it.label}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={it.onClick ?? onClose}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                delay: 0.04 + i * 0.04,
              }}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-zinc-900 bg-white px-3 py-2.5 text-left"
              style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-zinc-900 bg-[#FAF6EF]"
                style={{ boxShadow: "1px 1px 0 0 rgba(24,24,27,0.95)" }}
              >
                {it.icon}
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-[12.5px] font-extrabold text-zinc-900">
                  {it.label}
                </p>
                <p className="text-[10.5px] text-zinc-600">{it.sub}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
