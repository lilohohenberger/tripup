import { motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import receipt from "../assets/receipt.png";
import { showUndesignedToast } from "../components/Toast";
import { enterTransition, exitTransition } from "../lib/motion";

type Props = {
  onClose: () => void;
  onCapture: () => void;
};

/**
 * Receipt scan view (Figma "Create Poll" camera frame): static viewfinder
 * image, photo-library and manual-entry buttons, 80px peach shutter.
 */
export default function CameraView({ onClose, onCapture }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-40 bg-ink flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: 0, transition: enterTransition }}
      exit={{ y: "100%", transition: exitTransition }}
    >
      <div className="flex items-center px-6 py-4 pt-[max(16px,env(safe-area-inset-top))]">
        <IconButton symbol="chevronBackward" label="Back" onClick={onClose} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-2 pb-[max(0px,env(safe-area-inset-bottom))]">
        {/* Static viewfinder */}
        <div className="flex-1 min-h-0 relative rounded-card overflow-hidden w-full">
          <img src={receipt} alt="Receipt" className="absolute inset-0 size-full object-cover" />
        </div>
        {/* Controls: library / shutter / manual entry */}
        <div className="flex items-center justify-between py-4 w-full">
          <button
            aria-label="Photo library"
            onClick={showUndesignedToast}
            className="size-12 border border-white rounded-pill flex items-center justify-center cursor-pointer active:bg-surface group"
          >
            <SFSymbol
              name="photo"
              className="font-light text-white text-[16px] leading-none group-active:text-ink"
            />
          </button>
          <button
            onClick={onCapture}
            aria-label="Take photo"
            className="size-20 bg-peach border border-ink rounded-pill flex items-center justify-center cursor-pointer active:brightness-95"
          >
            <span className="size-16 bg-surface border border-ink rounded-pill block" />
          </button>
          <button
            aria-label="Enter manually"
            onClick={showUndesignedToast}
            className="size-12 border border-white rounded-pill flex items-center justify-center cursor-pointer active:bg-surface group"
          >
            <SFSymbol
              name="rectAndPencil"
              className="font-light text-white text-[16px] leading-none group-active:text-ink"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
