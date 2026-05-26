"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Bot,
  ChevronLeft,
  Home as HomeIcon,
  Menu,
  Moon,
  NotebookPen,
  Sun,
  User2,
  Wind,
} from "lucide-react";
import {
  NavProvider,
  PhoneFrame,
  ThemeProvider,
  useNav,
  useTheme,
  type StackScreen,
  type Tab,
} from "./ui";
import HomeScreen from "./screens/HomeScreen";
import JournalScreen from "./screens/JournalScreen";
import AIChatScreen from "./screens/AIChatScreen";
import BreathingScreen from "./screens/BreathingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RoutineScreen from "./screens/RoutineScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import SleepScreen from "./screens/SleepScreen";
import CalmScreen from "./screens/CalmScreen";
import CommunityScreen from "./screens/CommunityScreen";

const TAB_TITLE: Record<Tab, string> = {
  home: "Today",
  journal: "Journal",
  chat: "Lumi",
  meditate: "Breathe",
  profile: "You",
};

const STACK_TITLE: Record<NonNullable<StackScreen>, string> = {
  routine: "Daily routine",
  analytics: "Mood analytics",
  sleep: "Sleep recovery",
  calm: "Calm space",
  community: "Circles",
};

export default function AppShell() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tab, setTab] = useState<Tab>("home");
  const [stack, setStack] = useState<StackScreen>(null);

  const nav = useMemo(
    () => ({
      tab,
      setTab: (t: Tab) => {
        setStack(null);
        setTab(t);
      },
      stack,
      push: (s: NonNullable<StackScreen>) => setStack(s),
      pop: () => setStack(null),
    }),
    [tab, stack],
  );

  return (
    <ThemeProvider theme={theme} toggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
      <NavProvider value={nav}>
        <PhoneFrame>
          <ShellInner
            tabTitle={TAB_TITLE[tab]}
            stackTitle={stack ? STACK_TITLE[stack] : null}
          />
        </PhoneFrame>
      </NavProvider>
    </ThemeProvider>
  );
}

/* ---------------------------- inner shell ---------------------------- */

function ShellInner({
  tabTitle,
  stackTitle,
}: {
  tabTitle: string;
  stackTitle: string | null;
}) {
  const { theme, toggle, bg, ink } = useTheme();
  const { tab, stack, pop } = useNav();
  const isDark = theme === "dark";

  const screenKey = stack ? `stack:${stack}` : `tab:${tab}`;

  return (
    <motion.div
      animate={{ backgroundColor: bg }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex flex-col"
    >
      {/* Status bar */}
      <div
        className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-7 pt-3 text-[11px] font-bold"
        style={{ color: ink }}
      >
        <span>9:41</span>
        <span className="flex items-center gap-1.5 opacity-90">
          <svg width="14" height="9" viewBox="0 0 14 9">
            {[2, 4, 6, 8].map((h, i) => (
              <rect
                key={i}
                x={i * 3}
                y={9 - h}
                width="2"
                height={h}
                rx="0.5"
                fill={isDark ? "#fff" : "#111"}
              />
            ))}
          </svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="18"
              height="9"
              rx="2"
              stroke={isDark ? "#fff" : "#111"}
            />
            <rect
              x="2"
              y="2"
              width="14"
              height="6"
              rx="1"
              fill={isDark ? "#fff" : "#111"}
            />
            <rect
              x="20"
              y="3.5"
              width="1.5"
              height="3"
              rx="0.5"
              fill={isDark ? "#fff" : "#111"}
            />
          </svg>
        </span>
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12">
        <div className="flex items-center gap-2">
          {stack ? (
            <ChipButton onClick={pop} aria="Back">
              <ChevronLeft className="h-4 w-4" strokeWidth={2.6} />
            </ChipButton>
          ) : (
            <ChipButton onClick={toggle} aria="Toggle theme">
              {isDark ? (
                <Sun className="h-4 w-4" strokeWidth={2.6} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={2.6} />
              )}
            </ChipButton>
          )}
          <p
            className="text-[12.5px] font-extrabold tracking-tight"
            style={{ color: ink }}
          >
            {stackTitle ?? tabTitle}
          </p>
        </div>
        <ChipButton aria="Menu">
          <Menu className="h-4 w-4" strokeWidth={2.6} />
        </ChipButton>
      </div>

      {/* Scrollable screen area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, x: stack ? 32 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: stack ? -32 : -12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="absolute inset-0 overflow-y-auto pb-24 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ScreenSwitch />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navbar */}
      {!stack && <BottomNav />}
    </motion.div>
  );
}

function ScreenSwitch() {
  const { tab, stack } = useNav();
  if (stack === "routine") return <RoutineScreen />;
  if (stack === "analytics") return <AnalyticsScreen />;
  if (stack === "sleep") return <SleepScreen />;
  if (stack === "calm") return <CalmScreen />;
  if (stack === "community") return <CommunityScreen />;
  switch (tab) {
    case "home":
      return <HomeScreen />;
    case "journal":
      return <JournalScreen />;
    case "chat":
      return <AIChatScreen />;
    case "meditate":
      return <BreathingScreen />;
    case "profile":
      return <ProfileScreen />;
  }
}

/* ------------------------------ pieces ------------------------------ */

function ChipButton({
  children,
  onClick,
  aria,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  aria: string;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      aria-label={aria}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2"
      style={{
        backgroundColor: dark ? "#003F54" : "#ffffff",
        color: dark ? "#ECECEC" : "#18181B",
        borderColor: dark ? "rgba(236,236,236,0.4)" : "#18181B",
        boxShadow: dark
          ? "2px 2px 0 0 rgba(236,236,236,0.18)"
          : "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      {children}
    </motion.button>
  );
}

function BottomNav() {
  const { tab, setTab } = useNav();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const items: { id: Tab; icon: React.ReactNode }[] = [
    { id: "home", icon: <HomeIcon className="h-4 w-4" strokeWidth={2.4} /> },
    { id: "journal", icon: <NotebookPen className="h-4 w-4" strokeWidth={2.4} /> },
    { id: "chat", icon: <Bot className="h-4 w-4" strokeWidth={2.4} /> },
    { id: "meditate", icon: <Wind className="h-4 w-4" strokeWidth={2.4} /> },
    { id: "profile", icon: <User2 className="h-4 w-4" strokeWidth={2.4} /> },
  ];
  return (
    <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2">
      <div
        className="flex items-center gap-1 rounded-full border-2 p-1.5"
        style={{
          backgroundColor: dark ? "#003F54" : "#18181B",
          borderColor: dark ? "rgba(236,236,236,0.3)" : "#18181B",
          boxShadow: dark
            ? "0 14px 30px -12px rgba(0,30,45,0.7)"
            : "0 14px 30px -12px rgba(0,0,0,0.55)",
        }}
      >
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <motion.button
              key={it.id}
              onClick={() => setTab(it.id)}
              whileTap={{ scale: 0.92 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full"
            >
              {active && (
                <motion.span
                  layoutId="navPill"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: dark ? "#57A999" : "#ffffff" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  active
                    ? dark
                      ? "text-[#003F54]"
                      : "text-zinc-900"
                    : dark
                    ? "text-[#9FB6BF]"
                    : "text-zinc-400"
                }`}
              >
                {it.icon}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
