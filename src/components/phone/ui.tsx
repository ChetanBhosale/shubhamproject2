"use client";

import { motion } from "framer-motion";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

/* ------------------------------- design tokens ----------------------------- */

export const COLORS = {
  cream: "#FAF6EF",
  espresso: "#231A2E",
  ink: "#18181B",
  peach: "#FFC7A6",
  peachDeep: "#C56B3F",
  peachSoft: "#F4C7B0",
  mint: "#A6E89E",
  mintSoft: "#C8E8B6",
  lavender: "#E0CCF2",
  lavenderDeep: "#7C4FB0",
  blue: "#BFD7F2",
  blueDeep: "#3F6FB0",
  butter: "#FFE9A8",
  rose: "#FFB59A",
  sand: "#F1E7DA",
  forest: "#1F5E3F",
  /* brand accents — used sparingly for emphasis, charts, active states */
  sage: "#B9CDBE",
  lavenderMuted: "#756187",
  mintTeal: "#57A999",
  warmOrange: "#F69A4A",
  deepOcean: "#003F54",
  surface: "#ECECEC",
} as const;

/* --------------------------------- theme --------------------------------- */

type Theme = "light" | "dark";

type ThemeCtx = {
  theme: Theme;
  toggle: () => void;
  bg: string;
  ink: string;
  muted: string;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({
  theme,
  toggle,
  children,
}: {
  theme: Theme;
  toggle: () => void;
  children: ReactNode;
}) {
  const isDark = theme === "dark";
  const value: ThemeCtx = {
    theme,
    toggle,
    bg: isDark ? "#0F2A38" : "#FAF6EF",
    ink: isDark ? "#ECECEC" : "#18181B",
    muted: isDark ? "#9FB6BF" : "#71717A",
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}

/* -------------------------------- navigation ------------------------------ */

export type Tab = "home" | "journal" | "chat" | "meditate" | "profile";
export type StackScreen =
  | "routine"
  | "analytics"
  | "sleep"
  | "calm"
  | "community"
  | null;

type NavCtx = {
  tab: Tab;
  setTab: (t: Tab) => void;
  stack: StackScreen;
  push: (s: NonNullable<StackScreen>) => void;
  pop: () => void;
};

const NavContext = createContext<NavCtx | null>(null);

export function NavProvider({
  value,
  children,
}: {
  value: NavCtx;
  children: ReactNode;
}) {
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("NavProvider missing");
  return ctx;
}

/* --------------------------------- frame --------------------------------- */

export function PhoneFrame({
  children,
  width = 380,
  height = 800,
  bg = COLORS.cream,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  bg?: string;
}) {
  return (
    <div className="relative">
      <div
        className="relative rounded-[58px] p-[3px]"
        style={{
          width,
          height,
          background:
            "linear-gradient(160deg,#d6d2cc 0%,#a8a39c 35%,#8c8780 55%,#cfcac3 75%,#b3aea7 100%)",
          boxShadow:
            "0 50px 80px -30px rgba(60,50,40,0.35), 0 25px 40px -20px rgba(60,50,40,0.22), 0 1px 2px rgba(0,0,0,0.15)",
        }}
      >
        <span className="absolute -left-[4px] top-[110px] h-[30px] w-[4px] rounded-l-sm bg-[linear-gradient(90deg,#8a857e,#b6b1aa)]" />
        <span className="absolute -left-[4px] top-[170px] h-[55px] w-[4px] rounded-l-sm bg-[linear-gradient(90deg,#8a857e,#b6b1aa)]" />
        <span className="absolute -left-[4px] top-[240px] h-[55px] w-[4px] rounded-l-sm bg-[linear-gradient(90deg,#8a857e,#b6b1aa)]" />
        <span className="absolute -right-[4px] top-[210px] h-[90px] w-[4px] rounded-r-sm bg-[linear-gradient(270deg,#8a857e,#b6b1aa)]" />
        <div className="relative h-full w-full rounded-[55px] bg-black p-[5px]">
          <motion.div
            animate={{ backgroundColor: bg }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full overflow-hidden rounded-[51px]"
          >
            <div className="absolute left-1/2 top-[10px] z-30 h-[28px] w-[105px] -translate-x-1/2 rounded-full bg-black" />
            {children}
            <div className="absolute bottom-2 left-1/2 z-40 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-zinc-900/30" />
          </motion.div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute left-1/2 top-full mt-5 h-7 w-[260px] -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ backgroundColor: "rgba(60,50,40,0.18)" }}
      />
    </div>
  );
}

/* ---------------------------- shared primitives --------------------------- */

export function NeoCard({
  children,
  bg,
  className = "",
  padding = "p-3",
  onClick,
}: {
  children: ReactNode;
  bg: string;
  className?: string;
  padding?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { y: -2 } : { y: -1 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`rounded-[22px] border-2 border-zinc-900 ${padding} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
      style={{
        backgroundColor: bg,
        boxShadow: "3px 3px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      {children}
    </motion.div>
  );
}

export function NeoButton({
  children,
  bg = COLORS.ink,
  fg = "#ffffff",
  className = "",
  onClick,
}: {
  children: ReactNode;
  bg?: string;
  fg?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl border-2 border-zinc-900 px-3 py-2 text-[12px] font-bold ${className}`}
      style={{
        backgroundColor: bg,
        color: fg,
        boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      {children}
    </motion.button>
  );
}

export function ScreenShell({ children }: { children: ReactNode }) {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  };
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col px-5 pb-6"
    >
      {children}
    </motion.div>
  );
}

export const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 26 },
  },
};

/* ------------------------------ mood faces ------------------------------- */

export function HappyFace({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M7 11c1-1 2-1 3 0" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 11c1-1 2-1 3 0" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 15c1.2 1 4.8 1 6 0" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
export function AngryFace({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M7 9.5l3 1.5" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 9.5l-3 1.5" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9.5" cy="12" r="0.9" fill="#1f2937" />
      <circle cx="14.5" cy="12" r="0.9" fill="#1f2937" />
      <path d="M9 16c1.2-1.2 4.8-1.2 6 0" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
export function SleepyFace({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M7 12c1-0.6 2-0.6 3 0" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 12c1-0.6 2-0.6 3 0" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.5 16h5" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
export function BoredFace({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <circle cx="9.5" cy="11" r="0.9" fill="#1f2937" />
      <circle cx="14.5" cy="11" r="0.9" fill="#1f2937" />
      <path d="M9 15.5h6" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
