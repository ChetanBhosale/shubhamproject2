"use client";

import { motion } from "framer-motion";
import { Bed, Moon, Music2 } from "../icons";
import { useState } from "react";
import { ScreenShell, item } from "../ui";

/* High-contrast typography tokens */
const HEADING = "#1B1B1B";       // dark charcoal
const BODY = "#3F3A36";          // deep warm gray
const META = "#6B645E";          // muted brown-gray
const LABEL = "#4A4541";         // dark gray section labels

/* Surfaces */
const BG = "#F1EAD9";            // soft warm beige (page)
const CARD = "#FAF4E5";           // slightly lighter cream card
const CARD_DEEP = "#EDE3CD";      // deeper cream for halo + active states
const BORDER = "rgba(27,27,27,0.10)"; // thin visible hairline

/* Brand accents */
const SAGE = "#9DBCA9";           // accents
const MINT_TEAL = "#3F8B7C";      // CTA depth + arc
const DEEP_OCEAN = "#003F54";

const ROUTINE = [
  { l: "Dim the lights", t: "9:30 PM" },
  { l: "Phone in another room", t: "9:45 PM" },
  { l: "Stretch · 5 min", t: "10:00 PM" },
  { l: "Sleep story · 12 min", t: "10:15 PM" },
];

const SOUNDS = [
  { l: "Soft rain" },
  { l: "Ocean" },
  { l: "Sage forest" },
];

export default function SleepScreen() {
  const [active, setActive] = useState("Soft rain");

  return (
    <div className="relative min-h-full" style={{ backgroundColor: BG }}>
      <ScreenShell>
        {/* header */}
        <motion.div variants={item} className="mt-1 flex items-center justify-between">
          <div className="leading-tight">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: LABEL }}
            >
              Tonight
            </p>
            <p
              className="mt-0.5 text-[17px] font-extrabold tracking-tight"
              style={{ color: HEADING }}
            >
              Sleep recovery
            </p>
          </div>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: CARD,
              boxShadow: `inset 0 0 0 1px ${BORDER}, 0 4px 10px -6px rgba(27,27,27,0.18)`,
              color: HEADING,
            }}
          >
            <Moon className="h-4 w-4" />
          </span>
        </motion.div>

        {/* score halo */}
        <motion.div variants={item} className="mt-4 flex justify-center">
          <div
            className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 28%, ${CARD} 0%, ${CARD_DEEP} 70%, ${CARD_DEEP} 100%)`,
              boxShadow:
                "0 18px 32px -14px rgba(40,30,15,0.25), inset 0 0 0 1px rgba(27,27,27,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 180 180"
              aria-hidden
            >
              <circle
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke="rgba(27,27,27,0.10)"
                strokeWidth="3"
              />
              <circle
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke={MINT_TEAL}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 82}
                strokeDashoffset={(1 - 0.86) * 2 * Math.PI * 82}
              />
            </svg>
            <div className="relative text-center">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: LABEL }}
              >
                Sleep score
              </p>
              <p
                className="mt-1 text-[46px] font-extrabold leading-none tracking-tight"
                style={{ color: HEADING }}
              >
                86
              </p>
              <p className="mt-1.5 text-[12px] font-semibold" style={{ color: BODY }}>
                Restorative · 7h 24m
              </p>
            </div>
          </div>
        </motion.div>

        {/* routine */}
        <motion.div variants={item} className="mt-6">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: LABEL }}
          >
            Tonight’s wind-down
          </p>
          <div className="mt-2.5 space-y-2">
            {ROUTINE.map((r, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
                style={{
                  backgroundColor: CARD,
                  boxShadow: `inset 0 0 0 1px ${BORDER}, 0 6px 14px -10px rgba(40,30,15,0.18)`,
                }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: CARD_DEEP,
                    color: DEEP_OCEAN,
                    boxShadow: `inset 0 0 0 1px ${BORDER}`,
                  }}
                >
                  <Bed className="h-4 w-4" />
                </span>
                <span
                  className="flex-1 text-[13.5px] font-semibold"
                  style={{ color: BODY }}
                >
                  {r.l}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: BG,
                    color: META,
                    boxShadow: `inset 0 0 0 1px ${BORDER}`,
                  }}
                >
                  {r.t}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* white noise */}
        <motion.div variants={item} className="mt-6">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: LABEL }}
          >
            White noise
          </p>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {SOUNDS.map((s) => {
              const on = active === s.l;
              return (
                <motion.button
                  key={s.l}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive(s.l)}
                  className="rounded-2xl px-2 py-3 text-[12px] font-bold tracking-tight"
                  style={{
                    color: on ? HEADING : BODY,
                    backgroundColor: on ? CARD_DEEP : CARD,
                    boxShadow: on
                      ? `inset 0 0 0 1.5px ${MINT_TEAL}, 0 8px 18px -10px rgba(40,30,15,0.22)`
                      : `inset 0 0 0 1px ${BORDER}, 0 4px 10px -8px rgba(40,30,15,0.15)`,
                  }}
                >
                  <Music2
                    className="mx-auto mb-1 h-4 w-4"

                    style={{ color: on ? MINT_TEAL : LABEL }}
                  />
                  {s.l}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="mt-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="w-full rounded-full px-3 py-3.5 text-[14px] font-extrabold tracking-tight"
            style={{
              color: "#FFFFFF",
              background: `linear-gradient(180deg, ${MINT_TEAL} 0%, ${DEEP_OCEAN} 100%)`,
              boxShadow:
                "0 14px 26px -10px rgba(0,63,84,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            Begin tonight’s routine
          </motion.button>
          <p
            className="mt-2 text-center text-[11px] font-semibold"
            style={{ color: META }}
          >
            ~18 min · auto-dims your screen at 10:30 PM
          </p>
        </motion.div>
      </ScreenShell>
    </div>
  );
}
