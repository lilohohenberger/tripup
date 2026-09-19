import { useEffect, useRef, useState, type ReactNode } from "react";
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
 *
 * Two detents, like iOS sheets: swipe up to expand to (almost) full screen
 * — the content scrolls inside — swipe down to collapse or dismiss.
 */
export default function BottomSheet({ open, onClose, children }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const availRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  function expand() {
    if (availRef.current) setFullHeight(availRef.current.offsetHeight);
    setExpanded(true);
  }

  function handleDragEnd(offsetY: number, velocityY: number) {
    if (offsetY < -60 || velocityY < -500) expand();
    else if (offsetY > 80 || velocityY > 500) {
      if (expanded) setExpanded(false);
      else onClose();
    }
  }

  const dragProps = {
    drag: "y" as const,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: expanded ? 0.05 : 0.25, bottom: 0.4 },
    dragSnapToOrigin: true,
    onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) =>
      handleDragEnd(info.offset.y, info.velocity.y),
  };

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
            className="absolute inset-0 z-30 px-2 pb-[max(16px,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+16px)] pointer-events-none"
            initial={{ y: "110%" }}
            animate={{ y: 0, transition: enterTransition }}
            exit={{ y: "110%", transition: exitTransition }}
          >
            <div ref={availRef} className="h-full flex flex-col justify-end">
              <motion.div
                /* while collapsed the whole card is the drag handle; expanded,
                   dragging stays on the grabber so the content can scroll */
                {...(expanded ? {} : dragProps)}
                animate={{ height: expanded && fullHeight ? fullHeight : "auto" }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="bg-ink border border-white rounded-card overflow-hidden flex flex-col items-center w-full max-h-full pointer-events-auto"
              >
                <motion.div
                  {...(expanded ? dragProps : {})}
                  className="w-full flex justify-center pt-1 pb-6 shrink-0 touch-none"
                >
                  <div className="bg-surface h-px w-20 rounded-pill" />
                </motion.div>
                <div className="w-full flex-1 min-h-0 overflow-y-auto">
                  {/* body: no top padding — the 24px card gap under the grabber is all */}
                  <div className="w-full px-2 pb-10 flex flex-col items-center gap-[21px]">
                    {children}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
