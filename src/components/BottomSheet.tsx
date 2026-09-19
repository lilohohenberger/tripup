import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { enterTransition, exitTransition } from "../lib/motion";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Floating bottom sheet (Figma "Bottom Sheet"): ink card with 1px white
 * border, radius 40, 80×1 white grabber; floats 16px above the bottom edge
 * with an 8px side inset, over a 60% black overlay.
 */
export default function BottomSheet({ open, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/60 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: enterTransition }}
            exit={{ opacity: 0, transition: exitTransition }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 px-2 pb-[max(16px,env(safe-area-inset-bottom))]"
            initial={{ y: "110%" }}
            animate={{ y: 0, transition: enterTransition }}
            exit={{ y: "110%", transition: exitTransition }}
          >
            <div className="bg-ink border border-white rounded-card overflow-hidden flex flex-col items-center gap-6 w-full">
              <div className="pt-1">
                <div className="bg-surface h-px w-20 rounded-pill" />
              </div>
              <div className="w-full px-2 pt-6 pb-10 flex flex-col items-center gap-[21px]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
