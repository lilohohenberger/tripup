import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SFSymbol from "./SFSymbol";

type ToastContent = { kind: "undesigned" } | { kind: "member"; name: string };

let emit: ((content: ToastContent) => void) | null = null;

/** Show the "not designed yet" toast from anywhere. */
export function showUndesignedToast() {
  emit?.({ kind: "undesigned" });
}

/** Confirmation banner after someone joins the group (Figma "New person in group"). */
export function showMemberAddedToast(name: string) {
  emit?.({ kind: "member", name });
}

/**
 * Top banner: white card, 1px black border, slides in from the top and
 * dismisses itself — or on tap / swipe up.
 */
export default function ToastHost() {
  const [content, setContent] = useState<ToastContent | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    emit = (c) => {
      setContent(c);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setContent(null), 4500);
    };
    return () => {
      emit = null;
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {content && (
        <motion.button
          onClick={() => setContent(null)}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.9, bottom: 0.15 }}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.y < -30 || info.velocity.y < -400) setContent(null);
          }}
          className={`absolute top-[max(16px,env(safe-area-inset-top))] left-2 right-2 z-[60] bg-surface border border-black rounded-card px-6 py-4 text-left cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.25)] ${
            content.kind === "member" ? "flex items-center gap-2" : "flex flex-col gap-0.5"
          }`}
          initial={{ y: "-150%", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
          exit={{ y: "-150%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
        >
          {content.kind === "member" ? (
            <>
              <SFSymbol
                name="personCheckmark"
                className="text-[24px] font-light text-periwinkle shrink-0"
              />
              <span className="flex-1 min-w-0 text-[16px] font-medium leading-normal text-ink">
                {content.name} has successfully been added to the group
              </span>
            </>
          ) : (
            <>
              <span className="text-[16px] font-medium leading-normal text-ink">
                Lilo didn’t design this yet 🙂
              </span>
              <span className="text-[12px] leading-normal text-ink">
                There’s more where that came from if you hire her
              </span>
            </>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
