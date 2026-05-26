"use client";

import { motion } from "framer-motion";
import { Phone, Wind } from "lucide-react";
import { COLORS, NeoCard, ScreenShell, item } from "../ui";

const STEPS = [
  "5 things you can see",
  "4 things you can feel",
  "3 things you can hear",
  "2 things you can smell",
  "1 thing you can taste",
];

export default function CalmScreen() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          background: `linear-gradient(180deg, ${COLORS.sage} 0%, transparent 100%)`,
        }}
      />
      <ScreenShell>
        <motion.div variants={item} className="mt-1 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600">
            You’re safe here
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-tight text-zinc-900">
            I’m overwhelmed.
          </h1>
        </motion.div>

        <motion.div variants={item} className="mt-5 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border-2 border-zinc-900"
            style={{
              background: `radial-gradient(circle at 35% 30%, #ffffff, ${COLORS.sage})`,
              boxShadow: "4px 4px 0 0 rgba(24,24,27,0.95)",
            }}
          >
            <Wind className="h-5 w-5" strokeWidth={2.4} />
            <p className="mt-1 text-[13px] font-extrabold tracking-tight text-zinc-900">
              Breathe with me
            </p>
            <p className="text-[10px] text-zinc-700">60 seconds</p>
          </motion.button>
        </motion.div>

        <motion.div variants={item} className="mt-5">
          <NeoCard bg="#ffffff" padding="p-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              5-4-3-2-1 grounding
            </p>
            <ol className="mt-2 space-y-1.5">
              {STEPS.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-900"
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-900 text-[10px] font-bold"
                    style={{ backgroundColor: COLORS.butter }}
                  >
                    {5 - i}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </NeoCard>
        </motion.div>

        <motion.div variants={item} className="mt-3">
          <NeoCard bg={COLORS.mintSoft} padding="p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
              Affirmation
            </p>
            <p className="mt-1 text-[14px] font-extrabold leading-snug text-zinc-900">
              “This feeling is a wave. It will pass.”
            </p>
          </NeoCard>
        </motion.div>

        <motion.div variants={item} className="mt-3">
          <NeoCard bg={COLORS.rose} padding="p-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                <Phone className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-[13px] font-extrabold text-zinc-900">
                  Call a trusted person
                </p>
                <p className="text-[10.5px] text-zinc-700">Sam · best friend</p>
              </div>
              <button
                className="rounded-full border-2 border-zinc-900 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-white"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                Call
              </button>
            </div>
          </NeoCard>
        </motion.div>
      </ScreenShell>
    </div>
  );
}
