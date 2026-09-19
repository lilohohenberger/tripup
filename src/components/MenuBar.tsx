import { motion } from "framer-motion";
import SFSymbol from "./SFSymbol";
import IconButton from "./IconButton";
import type { SymbolName } from "./SFSymbol";

type Props = {
  /** Which tab is highlighted. */
  active?: "home" | "expenses";
  onHome?: () => void;
  onExpenses?: () => void;
  /** Right-hand 48px action button: plus on the dashboard, xmark while the FAB menu is open. */
  action: Extract<SymbolName, "plus" | "xmark">;
  onAction?: () => void;
  /** The FAB overlay renders its own copy without the shared slide element. */
  slide?: boolean;
};

/**
 * Bottom menu bar (Figma "Menu Bar"): ink pill with white border holding the
 * tab buttons; the active white pill slides over like the segmented tabs.
 */
export default function MenuBar({ active = "home", onHome, onExpenses, action, onAction, slide = true }: Props) {
  const tabs = [
    { key: "home" as const, symbol: "house" as const, label: "Home", onClick: onHome },
    { key: "expenses" as const, symbol: "banknote" as const, label: "Expenses", onClick: onExpenses },
  ];
  return (
    <div className="absolute bottom-0 inset-x-0 z-30 flex items-end justify-between px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] bg-gradient-to-b from-[rgba(19,19,19,0)] to-ink">
      <div className="bg-ink border border-white rounded-pill flex items-center gap-1">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              aria-label={t.label}
              aria-current={isActive ? "page" : undefined}
              onClick={t.onClick}
              className="relative w-[68px] h-12 rounded-pill flex items-center justify-center cursor-pointer"
            >
              {isActive &&
                (slide ? (
                  <motion.span
                    layoutId="menu-active"
                    className="absolute inset-0 bg-surface rounded-pill"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                ) : (
                  <span className="absolute inset-0 bg-surface rounded-pill" />
                ))}
              <SFSymbol
                name={t.symbol}
                className={`relative font-light text-[16px] leading-none transition-colors duration-300 ${
                  isActive ? "text-ink" : "text-white"
                }`}
              />
            </button>
          );
        })}
      </div>
      <IconButton
        symbol={action}
        label={action === "plus" ? "Add" : "Close menu"}
        onClick={onAction}
        glyphSize={16}
        size={64}
      />
    </div>
  );
}
