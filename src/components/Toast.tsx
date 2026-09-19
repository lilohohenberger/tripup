import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

let emit: (() => void) | null = null;

/** Show the "not designed yet" toast from anywhere. */
export function showUndesignedToast() {
  emit?.();
}

/**
 * Top toast for undesigned interactions: white card, 1px black border,
 * slides in from the top and dismisses itself (or on tap).
 */
export default function ToastHost() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    emit = () => {
      setVisible(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setVisible(false), 4500);
    };
    return () => {
      emit = null;
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => setVisible(false)}
          className="absolute top-[max(16px,env(safe-area-inset-top))] left-2 right-2 z-[60] bg-surface border border-black rounded-card px-6 py-4 flex flex-col gap-0.5 text-left cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          initial={{ y: "-150%", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
          exit={{ y: "-150%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
        >
          <span className="text-[16px] font-medium leading-normal text-ink">
            Lilo didn’t design this yet 🙂
          </span>
          <span className="text-[12px] leading-normal text-ink">
            There’s more where that came from if you hire her
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
