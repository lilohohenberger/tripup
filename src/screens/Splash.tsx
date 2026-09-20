import { motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import { exitTransition } from "../lib/motion";

/** iOS Safari tab (not installed to the home screen) → show the PWA hint. */
export function isIosBrowserTab(): boolean {
  // ?hint previews the iOS install hint on any device
  if (new URLSearchParams(window.location.search).has("hint")) return true;
  const ua = navigator.userAgent;
  const isIos =
    /iPhone|iPad|iPod/.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true);
  return isIos && !standalone;
}

/** Splash screen (Figma 2143:45293): peach with the 202px app icon. */
export function SplashLogo() {
  return (
    <motion.div
      className="absolute inset-0 z-[70] bg-peach flex items-center justify-center"
      exit={{ opacity: 0, transition: exitTransition }}
    >
      <img src="/icon-512.png" alt="TripUp" className="size-[202px]" />
    </motion.div>
  );
}

/** PWA hint after the splash, iOS browser tabs only (Figma 2143:45282). */
export function SplashHint({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-[70] bg-peach flex flex-col justify-end px-2 pb-10"
      exit={{ opacity: 0, transition: exitTransition }}
    >
      <div className="flex flex-col gap-20 w-full">
        <p className="px-4 text-[40px] font-medium leading-normal text-ink">Hi there!</p>
        <div className="flex flex-col gap-6 w-full">
          <div className="px-4 flex flex-col gap-4 text-ink">
            <p className="text-[16px] leading-normal whitespace-pre-wrap">
              For the optimal experience with this app, press “Share” in your browser and “Add to
              homescreen”. This will add the TripUp Icon to your homescreen and give you a real
              immersive app experience :){"\n\n"}Apart from that: Have fun!
            </p>
            <p className="text-[24px] font-medium leading-normal">Love, Lilo</p>
          </div>
          <button
            onClick={onContinue}
            className="bg-surface border border-black rounded-pill h-16 px-4 py-2 flex items-center justify-center gap-1 w-full cursor-pointer text-ink text-[24px] font-medium leading-normal active:bg-ink active:text-white transition-colors"
          >
            Continue <SFSymbol name="arrowRight" className="font-medium" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
