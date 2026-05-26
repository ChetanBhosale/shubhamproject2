"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart } from "../icons";

export default function SignOutFlow({
  onClose,
}: {
  onClose: () => void;
}) {
  const [stage, setStage] = useState<"confirm" | "saying-bye">("confirm");

  useEffect(() => {
    if (stage !== "saying-bye") return;
    const id = window.setTimeout(() => onClose(), 2200);
    return () => window.clearTimeout(id);
  }, [stage, onClose]);

  return (
    <AnimatePresence>
      {stage === "confirm" && (
        <motion.div
          key="confirm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-end"
          style={{ backgroundColor: "rgba(2,28,40,0.35)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full rounded-t-[28px] border-2 border-zinc-900 bg-[#FAF6EF] p-5 pb-7"
            style={{ boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.35)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300" />
            <p className="mt-3 text-[16px] font-extrabold leading-tight tracking-tight text-zinc-900">
              Are you sure you want to leave for now?
            </p>
            <p className="mt-1 text-[12px] font-medium text-zinc-600">
              Your reflections, drafts, and rituals will be waiting when you return.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="rounded-full border-2 border-zinc-900 bg-white py-2.5 text-[13px] font-extrabold text-zinc-900"
                style={{ boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)" }}
              >
                Stay a little longer
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStage("saying-bye")}
                className="rounded-full border-2 border-zinc-900 py-2.5 text-[13px] font-extrabold text-white"
                style={{
                  background: "linear-gradient(180deg,#3F8B7C 0%,#003F54 100%)",
                  boxShadow: "2px 2px 0 0 rgba(24,24,27,0.95)",
                }}
              >
                Sign out peacefully
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {stage === "saying-bye" && (
        <motion.div
          key="bye"
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
          {/* slow ambient pulse */}
          <motion.span
            aria-hidden
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(40% 40% at 50% 35%, rgba(157,188,169,0.25), transparent 70%)",
                "radial-gradient(45% 45% at 55% 45%, rgba(157,188,169,0.30), transparent 70%)",
                "radial-gradient(40% 40% at 50% 35%, rgba(157,188,169,0.25), transparent 70%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 24 }}
            className="relative flex flex-col items-center text-center"
          >
            <motion.span
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30"
              style={{
                background:
                  "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.18), transparent 70%)",
              }}
            >
              <Heart className="h-7 w-7 text-white" weight="fill" />
            </motion.span>
            <p className="mt-4 text-[18px] font-extrabold tracking-tight text-white">
              Take care of yourself.
            </p>
            <p className="mt-1 text-[12.5px] font-medium text-[#D8E7DC]">
              Your journey continues when you return.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
