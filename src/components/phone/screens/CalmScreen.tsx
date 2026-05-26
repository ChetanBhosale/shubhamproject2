"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ChatCircleDots,
  LifeBuoy,
  Pencil,
  Phone,
  Wind,
  X,
} from "../icons";
import { COLORS, NeoCard, ScreenShell, item } from "../ui";

const STEPS = [
  "5 things you can see",
  "4 things you can feel",
  "3 things you can hear",
  "2 things you can smell",
  "1 thing you can taste",
];

const AFFIRMATIONS = [
  "This feeling is a wave. It will pass.",
  "You are safe. Let's slow things down together.",
  "Breath by breath, you are returning to yourself.",
];

export default function CalmScreen() {
  const [contactName, setContactName] = useState("Sam");
  const [contactRel, setContactRel] = useState("best friend");
  const [editingContact, setEditingContact] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [silent, setSilent] = useState(false);

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
            You're safe here
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-tight text-zinc-900">
            I'm overwhelmed.
          </h1>
          <p className="mt-1 text-[12px] font-medium text-zinc-700">
            Let's slow things down together.
          </p>
        </motion.div>

        {/* Big breathe button */}
        <motion.div variants={item} className="mt-5 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setCalmMode(true)}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border-2 border-zinc-900"
            style={{
              background: `radial-gradient(circle at 35% 30%, #ffffff, ${COLORS.sage})`,
              boxShadow: "4px 4px 0 0 rgba(24,24,27,0.95)",
            }}
          >
            <Wind className="h-5 w-5" />
            <p className="mt-1 text-[13px] font-extrabold tracking-tight text-zinc-900">
              Breathe with me
            </p>
            <p className="text-[10px] text-zinc-700">60 seconds</p>
          </motion.button>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item} className="mt-5 grid grid-cols-2 gap-2.5">
          <Quick
            bg="#fff"
            icon={<ChatCircleDots className="h-4 w-4" />}
            label="Send 'I need support'"
            sub={`To ${contactName}`}
          />
          <Quick
            bg="#fff"
            icon={<LifeBuoy className="h-4 w-4" />}
            label="Calming mode"
            sub={calmMode ? "Active" : "Dim · breathe"}
            onClick={() => setCalmMode(true)}
          />
          <Quick
            bg="#fff"
            icon={<Wind className="h-4 w-4" />}
            label="Long-exhale breath"
            sub="2 minutes"
            onClick={() => setCalmMode(true)}
          />
          <Quick
            bg="#fff"
            icon={<Pencil className="h-4 w-4" />}
            label="Silent help mode"
            sub={silent ? "On" : "Hide app trace"}
            onClick={() => setSilent((v) => !v)}
            active={silent}
          />
        </motion.div>

        {/* Grounding */}
        <motion.div variants={item} className="mt-4">
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

        {/* Affirmation */}
        <motion.div variants={item} className="mt-3">
          <NeoCard bg={COLORS.mintSoft} padding="p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
              Affirmation
            </p>
            <p className="mt-1 text-[14px] font-extrabold leading-snug text-zinc-900">
              "{AFFIRMATIONS[0]}"
            </p>
          </NeoCard>
        </motion.div>

        {/* Trusted contact */}
        <motion.div variants={item} className="mt-3">
          <NeoCard bg={COLORS.rose} padding="p-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-white"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                <Phone className="h-4 w-4" />
              </span>
              <div className="flex-1 leading-tight">
                {!editingContact ? (
                  <>
                    <p className="text-[13px] font-extrabold text-zinc-900">
                      Call a trusted person
                    </p>
                    <p className="text-[10.5px] text-zinc-700">
                      {contactName} · {contactRel}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Name"
                      className="rounded-md border-2 border-zinc-900 bg-white px-2 py-1 text-[12px] font-bold text-zinc-900 outline-none"
                    />
                    <input
                      value={contactRel}
                      onChange={(e) => setContactRel(e.target.value)}
                      placeholder="Relationship"
                      className="rounded-md border-2 border-zinc-900 bg-white px-2 py-1 text-[11px] text-zinc-900 outline-none"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  className="rounded-full border-2 border-zinc-900 bg-zinc-900 px-3 py-1 text-[11px] font-bold text-white"
                  style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                >
                  Call
                </button>
                <button
                  onClick={() => setEditingContact((v) => !v)}
                  className="rounded-full border-2 border-zinc-900 bg-white px-3 py-1 text-[10px] font-bold text-zinc-900"
                  style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
                >
                  {editingContact ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </NeoCard>
        </motion.div>

        {/* Local emergency hotlines */}
        <motion.div variants={item} className="mt-3">
          <NeoCard bg={COLORS.lavender} padding="p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-700">
              Local emergency support
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Hotline label="Crisis line" number="988" />
              <Hotline label="Emergency" number="911" />
            </div>
            <p className="mt-2 text-[10px] text-zinc-700">
              Numbers shown are based on your region.
            </p>
          </NeoCard>
        </motion.div>
      </ScreenShell>

      <AnimatePresence>
        {calmMode && (
          <CalmingMode onClose={() => setCalmMode(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- pieces ------------------------------- */

function Quick({
  icon,
  label,
  sub,
  bg,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  bg: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="flex items-start gap-2 rounded-2xl border-2 border-zinc-900 px-3 py-2.5 text-left"
      style={{
        backgroundColor: active ? COLORS.sage : bg,
        boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
      }}
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-zinc-900 bg-white"
        style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
      >
        {icon}
      </span>
      <div className="flex-1 leading-tight">
        <p className="text-[11.5px] font-extrabold text-zinc-900">{label}</p>
        <p className="text-[10px] text-zinc-700">{sub}</p>
      </div>
    </motion.button>
  );
}

function Hotline({ label, number }: { label: string; number: string }) {
  return (
    <a
      href={`tel:${number}`}
      className="flex items-center justify-between rounded-2xl border-2 border-zinc-900 bg-white px-3 py-2"
      style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
    >
      <div className="leading-tight">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-zinc-600">
          {label}
        </p>
        <p className="text-[14px] font-extrabold text-zinc-900">{number}</p>
      </div>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-900 text-white"
        style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
      >
        <Phone className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

function CalmingMode({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 30%, #0F5973 0%, #022C3D 70%, #011a25 100%)",
      }}
    >
      {/* breathing orb */}
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full border-2 border-white/30"
        style={{
          background:
            "radial-gradient(circle at 35% 28%, rgba(157,188,169,0.45), rgba(15,89,115,0.6) 60%, rgba(2,28,40,0.8) 100%)",
        }}
      >
        <motion.p
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="text-[12px] font-bold uppercase tracking-[0.18em] text-white"
        >
          Breathe in
        </motion.p>
      </motion.div>

      <p className="absolute top-16 px-8 text-center text-[15px] font-extrabold tracking-tight text-white">
        You are safe.
      </p>
      <p className="absolute top-24 px-8 text-center text-[12px] font-medium text-[#D8E7DC]">
        Let's slow things down together.
      </p>

      <button
        onClick={onClose}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border-2 border-white/40 bg-white/10 px-4 py-2 text-[12px] font-bold text-white backdrop-blur"
      >
        I'm okay now
      </button>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-12 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30 bg-white/5 text-white backdrop-blur"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
