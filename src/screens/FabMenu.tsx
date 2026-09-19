import { AnimatePresence, motion } from "framer-motion";
import SFSymbol, { type SymbolName } from "../components/SFSymbol";
import MenuBar from "../components/MenuBar";
import { showUndesignedToast } from "../components/Toast";
import { enterTransition, exitTransition } from "../lib/motion";

type Props = {
  open: boolean;
  activeTab: "home" | "expenses";
  onClose: () => void;
  onAskGroup: () => void;
  onAddToItinerary: () => void;
  onAddExpense: () => void;
};

const items: { key: string; symbol: SymbolName; label: string }[] = [
  { key: "idea", symbol: "lightbulb", label: "Add Idea" },
  { key: "expense", symbol: "euroBanknote", label: "Add Expense" },
  { key: "poll", symbol: "chartBar", label: "Ask the group" },
  { key: "plan", symbol: "calendar", label: "Add to itinerary" },
];

/**
 * Create menu (Figma): white 62px pill rows over a 60% black overlay,
 * 24 Regular labels with SF Pro Light glyphs; the menu bar stays visible
 * with an xmark close button.
 */
export default function FabMenu({ open, activeTab, onClose, onAskGroup, onAddToItinerary, onAddExpense }: Props) {
  function handle(key: string) {
    if (key === "poll") onAskGroup();
    else if (key === "plan") onAddToItinerary();
    else if (key === "expense") onAddExpense();
    else showUndesignedToast();
  }
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
          <div className="absolute inset-x-[9px] bottom-[86px] z-30 flex flex-col gap-1 items-center">
            {items.map((item) => (
              <motion.button
                key={item.key}
                onClick={() => handle(item.key)}
                className="bg-surface border border-ink text-ink rounded-pill h-[62px] px-4 py-2 w-full flex items-center justify-center text-[24px] leading-normal cursor-pointer active:bg-ink active:text-white transition-colors"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: enterTransition }}
                exit={{ y: 24, opacity: 0, transition: exitTransition }}
              >
                <SFSymbol name={item.symbol} className="font-light" />
                <span>&nbsp;{item.label}</span>
              </motion.button>
            ))}
          </div>
          <MenuBar active={activeTab} slide={false} action="xmark" onAction={onClose} />
        </>
      )}
    </AnimatePresence>
  );
}
