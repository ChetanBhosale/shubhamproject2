"use client";

import { motion } from "framer-motion";
import { ChatCircleDots, Mic, SendHorizonal, Sun } from "../icons";
import { useEffect, useRef, useState } from "react";
import { COLORS, NeoCard, ScreenShell, item, useTheme } from "../ui";

type Msg = { from: "ai" | "me"; text: string };

const SEED: Msg[] = [
  { from: "ai", text: "Hi Alex, how’s your heart today? Anything on your mind?" },
  { from: "me", text: "Felt anxious before standup. Couldn’t shake it." },
  { from: "ai", text: "That’s real. Want to try a 60-second grounding together?" },
];

const AI_REPLIES = [
  "Tell me a little more — what did the anxiety feel like in your body?",
  "Got it. Let’s slow down for a moment. Inhale 4, hold 4, exhale 6.",
  "You’re doing the brave thing by naming it. I’m here.",
  "If it helps, we can journal one sentence about it later.",
];

export default function AIChatScreen() {
  const { ink, muted } = useTheme();
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setDraft("");
    setTyping(true);
    const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "ai", text: reply }]);
    }, 1100);
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenShell>
        <motion.div variants={item} className="mt-1 flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900"
            style={{
              background: COLORS.lavenderMuted,
              color: "#fff",
              boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
            }}
          >
            <ChatCircleDots className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-extrabold" style={{ color: ink }}>
              Lumi
            </p>
            <p className="text-[10px]" style={{ color: muted }}>
              your AI companion · listening
            </p>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-3">
          <NeoCard bg={COLORS.butter} padding="px-3 py-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800">
              <Sun className="h-3.5 w-3.5" />
              Daily check-in · 1 min
            </p>
          </NeoCard>
        </motion.div>
      </ScreenShell>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mt-3 flex flex-col gap-3 pb-3">
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[78%] rounded-2xl border-2 border-zinc-900 px-3 py-2 text-[12.5px] leading-snug text-zinc-900"
                style={{
                  backgroundColor: m.from === "me" ? COLORS.sage : "#ffffff",
                  borderTopRightRadius: m.from === "me" ? 6 : 18,
                  borderTopLeftRadius: m.from === "me" ? 18 : 6,
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div
                className="rounded-2xl border-2 border-zinc-900 bg-white px-3 py-2.5"
                style={{
                  borderTopLeftRadius: 6,
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-zinc-700"
                      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* composer */}
      <div className="px-5 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div
            className="flex flex-1 items-center gap-2 rounded-full border-2 border-zinc-900 bg-white px-3 py-2"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(draft)}
              placeholder="Tell Lumi how you feel…"
              className="flex-1 bg-transparent text-[12px] text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-900"
            style={{
              backgroundColor: COLORS.lavenderMuted,
              color: "#fff",
              boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
            }}
          >
            <Mic className="h-4 w-4" />
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => send(draft)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-900 text-white"
            style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
          >
            <SendHorizonal className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
