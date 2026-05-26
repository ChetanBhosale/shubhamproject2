"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChatCircleDots, Compass, Heart } from "../icons";
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

type ReactionId = "relate" | "calm" | "proud" | "together";

const REACTIONS: {
  id: ReactionId;
  label: string;
  short: string;
  bg: string;
  ink: string;
}[] = [
  { id: "relate", label: "I relate", short: "I relate", bg: COLORS.lavender, ink: "#3A3D6B" },
  { id: "calm", label: "Sending calm", short: "Calm", bg: COLORS.sage, ink: "#2E4A3A" },
  { id: "proud", label: "Proud of you", short: "Proud", bg: COLORS.butter, ink: "#5B4416" },
  { id: "together", label: "You're not alone", short: "Together", bg: COLORS.peachSoft, ink: "#7A4534" },
];

type Post = {
  id: string;
  name: string;
  avatar: string;
  face: React.ReactNode;
  body: string;
  reactions: Record<ReactionId, number>;
  replies: number;
};

const SEED: Post[] = [
  {
    id: "p1",
    name: "Quiet Fox",
    avatar: COLORS.mint,
    face: <HappyFace />,
    body: "Took a 20 min walk with no podcast today. My brain stopped buzzing for the first time in weeks.",
    reactions: { relate: 28, calm: 41, proud: 22, together: 33 },
    replies: 18,
  },
  {
    id: "p2",
    name: "Slow Lake",
    avatar: COLORS.lavender,
    face: <SleepyFace />,
    body: "Reminder for fellow night owls: turning off socials at 10 actually worked. Slept 7h, wild.",
    reactions: { relate: 38, calm: 19, proud: 12, together: 17 },
    replies: 9,
  },
  {
    id: "p3",
    name: "Soft Rain",
    avatar: COLORS.peachSoft,
    face: <AngryFace />,
    body: "Bad day at work, came home, journaled for 5 mins. Didn't fix it, but I feel held by myself.",
    reactions: { relate: 71, calm: 60, proud: 44, together: 36 },
    replies: 32,
  },
];

const CIRCLES = [
  { l: "Burnout club", c: COLORS.peach, face: <AngryFace size={18} /> },
  { l: "Soft mornings", c: COLORS.butter, face: <HappyFace size={18} /> },
  { l: "Quiet minds", c: COLORS.lavender, face: <BoredFace size={18} /> },
  { l: "Sleep recovery", c: COLORS.blue, face: <SleepyFace size={18} /> },
];

export default function CommunityScreen() {
  const { ink, muted } = useTheme();
  const [posts, setPosts] = useState<Post[]>(SEED);
  /** id -> reaction picked by the current user, if any */
  const [picked, setPicked] = useState<Record<string, ReactionId | null>>({});
  const [openSheet, setOpenSheet] = useState<string | null>(null);

  function pickReaction(postId: string, r: ReactionId) {
    setPicked((s) => ({ ...s, [postId]: s[postId] === r ? null : r }));
    setPosts((arr) =>
      arr.map((p) => {
        if (p.id !== postId) return p;
        const prev = picked[postId] ?? null;
        const next = { ...p.reactions };
        if (prev === r) {
          next[r] = Math.max(0, next[r] - 1);
        } else {
          if (prev) next[prev] = Math.max(0, next[prev] - 1);
          next[r] = next[r] + 1;
        }
        return { ...p, reactions: next };
      }),
    );
  }

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
          Share reflection
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
        {posts.map((p) => {
          const total =
            p.reactions.relate +
            p.reactions.calm +
            p.reactions.proud +
            p.reactions.together;
          const userPick = picked[p.id] ?? null;
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
                  <p className="text-[12.5px] font-extrabold text-zinc-900">
                    {p.name}
                  </p>
                  <p className="text-[10.5px] text-zinc-500">just now · anon</p>
                </div>
                <Compass className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <p className="mt-2 text-[12.5px] leading-snug text-zinc-800">
                {p.body}
              </p>

              {/* reaction summary */}
              <div className="mt-2 flex items-center gap-2 text-[10.5px] font-semibold text-zinc-600">
                <ReactionStack reactions={p.reactions} />
                <span>{total} responses</span>
                <button
                  onClick={() =>
                    setOpenSheet(openSheet === p.id ? null : p.id)
                  }
                  className="ml-auto rounded-full border-2 border-zinc-900 bg-white px-2.5 py-1 text-[10.5px] font-bold text-zinc-900"
                  style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                >
                  {userPick
                    ? REACTIONS.find((r) => r.id === userPick)?.short
                    : "React"}
                </button>
                <button className="flex items-center gap-1 rounded-full border-2 border-zinc-900 bg-white px-2 py-1 text-[10.5px] font-bold text-zinc-900"
                  style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}>
                  <ChatCircleDots className="h-3.5 w-3.5" />
                  {p.replies}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {openSheet === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {REACTIONS.map((r) => {
                        const on = userPick === r.id;
                        return (
                          <motion.button
                            key={r.id}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ y: -1 }}
                            onClick={() => pickReaction(p.id, r.id)}
                            className="rounded-2xl border-2 border-zinc-900 px-2.5 py-2 text-left text-[11.5px] font-extrabold"
                            style={{
                              backgroundColor: on ? r.bg : "#FFFFFF",
                              color: on ? r.ink : "#1B1B1B",
                              boxShadow: on
                                ? "3px 3px 0 0 rgba(24,24,27,0.95)"
                                : "2px 2px 0 0 rgba(24,24,27,0.95)",
                            }}
                          >
                            {r.label}
                            <span className="ml-2 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-zinc-900">
                              {p.reactions[r.id] + (on ? 0 : 0)}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </NeoCard>
          );
        })}
      </motion.div>

      <motion.p
        variants={item}
        className="mt-4 text-center text-[10.5px] font-medium text-zinc-500"
      >
        Circles is moderated. Lumi gently softens unkind language.
      </motion.p>
    </ScreenShell>
  );
}

function ReactionStack({
  reactions,
}: {
  reactions: Record<ReactionId, number>;
}) {
  const top = Object.entries(reactions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => REACTIONS.find((r) => r.id === (id as ReactionId))!);
  return (
    <span className="flex -space-x-1.5">
      {top.map((r, i) => (
        <span
          key={r.id}
          className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-900 text-[9px] font-bold"
          style={{
            backgroundColor: r.bg,
            color: r.ink,
            zIndex: 3 - i,
          }}
          title={r.label}
        >
          {r.short[0]}
        </span>
      ))}
    </span>
  );
}

/* hush unused */
void Heart;
