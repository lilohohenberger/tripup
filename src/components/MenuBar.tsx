import SFSymbol from "./SFSymbol";
import IconButton from "./IconButton";
import SlidePill from "./SlidePill";

type Props = {
  /** Which tab is highlighted. */
  active?: "home" | "expenses";
  onHome?: () => void;
  onExpenses?: () => void;
  /** The plus button — creates directly (a plan on home, an expense on expenses). */
  onAdd?: () => void;
};

/**
 * Bottom menu bar (Figma "Menu Bar"): ink pill with white border holding the
 * tab buttons; the active white pill slides over — or can be dragged across
 * like a toggle.
 */
export default function MenuBar({ active = "home", onHome, onExpenses, onAdd }: Props) {
  const tabs = [
    { key: "home" as const, symbol: "house" as const, label: "Home", onClick: onHome },
    { key: "expenses" as const, symbol: "banknote" as const, label: "Expenses", onClick: onExpenses },
  ];
  return (
    /* pointer-events-none: only the controls catch touches — swipes over the
       gradient (and between the buttons) scroll the content underneath */
    <div className="absolute bottom-0 inset-x-0 z-30 flex items-end justify-between px-6 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] bg-gradient-to-b from-[rgba(19,19,19,0)] to-ink pointer-events-none">
      <div className="bg-ink border border-white rounded-pill flex items-center gap-1 pointer-events-auto">
        {tabs.map((t, i) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              aria-label={t.label}
              aria-current={isActive ? "page" : undefined}
              onClick={t.onClick}
              className="relative w-[68px] h-12 rounded-pill flex items-center justify-center cursor-pointer"
            >
              {isActive && (
                <SlidePill
                  layoutId="menu-active"
                  index={i}
                  count={tabs.length}
                  onSelect={(target) => tabs[target].onClick?.()}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <SFSymbol
                name={t.symbol}
                className={`relative font-light text-[16px] leading-none transition-colors duration-300 pointer-events-none ${
                  isActive ? "text-ink" : "text-white"
                }`}
              />
            </button>
          );
        })}
      </div>
      <IconButton
        symbol="plus"
        label="Add"
        onClick={onAdd}
        glyphSize={16}
        size={64}
        className="pointer-events-auto"
      />
    </div>
  );
}
