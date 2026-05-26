"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  AngryFace,
  BoredFace,
  COLORS,
  HappyFace,
  NeoCard,
  ScreenShell,
  SleepyFace,
  item,
  useTheme,
} from "../ui";

const POSTS = [
  {
    id: "p1",
    name: "Quiet Fox",
    avatar: COLORS.mint,
    face: <HappyFace />,
    body: "Took a 20 min walk with no podcast today. My brain stopped buzzing for the first time in weeks.",
    hearts: 124,
    replies: 18,
  },
  {
    id: "p2",
    name: "Slow Lake",
    avatar: COLORS.lavender,
    face: <SleepyFace />,
    body: "Reminder for fellow night owls: turning off socials at 10 actually worked. Slept 7h, wild.",
    hearts: 86,
    replies: 9,
  },
  {
    id: "p3",
    name: "Soft Rain",
    avatar: COLORS.peachSoft,
    face: <AngryFace />,
    body: "Bad day at work, came home, journaled for 5 mins. Didn’t fix it, but I feel held by myself.",
    hearts: 211,
    replies: 32,
  },
];

const CIRCLES = [
  { l: "Burnout club", c: COLORS.peach, face: <AngryFace size={18} /> },
  { l: "Soft mornings", c: COLORS.butter, face: <HappyFace size={18} /> },
  { l: "Quiet minds", c: COLORS.lavender, face: <BoredFace size={18} /> },
];

export default function CommunityScreen() {
  const { ink, muted } = useTheme();
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  return (
    <ScreenShell>
      <motion.div variants={item} className="mt-1 flex items-center justify-between">
        <div className="leading-tight">
          <p className="text-[11px]" style={{ color: muted }}>
            Anonymous · safe space
          </p>
          <p className="text-[15px] font-extrabold" style={{ color: ink }}>
            Circles
          </p>
        </div>
        <button
          className="rounded-full border-2 border-zinc-900 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-white"
          style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
        >
          Share mood
        </button>
      </motion.div>

      <motion.div
        variants={item}
        className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
      >
        {CIRCLES.map((c, i) => (
          <NeoCard key={i} bg={c.c} padding="px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-900 bg-white">
                {c.face}
              </span>
              <span className="text-[12px] font-bold text-zinc-900">{c.l}</span>
            </div>
          </NeoCard>
        ))}
      </motion.div>

      <motion.div variants={item} className="mt-4 space-y-3">
        {POSTS.map((p) => {
          const isLiked = !!liked[p.id];
          return (
            <NeoCard key={p.id} bg="#ffffff" padding="p-3">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900"
                  style={{
                    backgroundColor: p.avatar,
                    boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                  }}
                >
                  {p.face}
                </span>
                <div className="flex-1 leading-tight">
                  <p className="text-[12.5px] font-extrabold text-zinc-900">{p.name}</p>
                  <p className="text-[10.5px] text-zinc-500">just now · anon</p>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <p className="mt-2 text-[12.5px] leading-snug text-zinc-800">{p.body}</p>
              <div className="mt-2 flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))}
                  className="flex items-center gap-1 text-[11px] font-bold"
                  style={{ color: isLiked ? COLORS.peachDeep : "#3f3f46" }}
                >
                  <Heart
                    className="h-3.5 w-3.5"
                    strokeWidth={2.4}
                    fill={isLiked ? COLORS.peachDeep : "none"}
                  />
                  {p.hearts + (isLiked ? 1 : 0)}
                </motion.button>
                <button className="flex items-center gap-1 text-[11px] font-bold text-zinc-700">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
                  {p.replies}
                </button>
                <span className="ml-auto rounded-full border-2 border-zinc-900 bg-white px-2 py-0.5 text-[10px] font-bold text-zinc-900">
                  send hug 🤍
                </span>
              </div>
            </NeoCard>
          );
        })}
      </motion.div>
    </ScreenShell>
  );
}
