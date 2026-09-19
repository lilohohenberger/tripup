import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import PillInput from "../components/PillInput";
import { showUndesignedToast } from "../components/Toast";
import receipt from "../assets/receipt.png";
import { expenseMembers, initialExpenseItems, type ExpenseItem } from "../data/expense";
import { enterTransition, exitTransition } from "../lib/motion";

type Props = {
  onClose: () => void;
  onSave: () => void;
};

type SplitMode = "equal" | "custom" | "parts";

let itemSeq = 100;

/**
 * Log-expense screen (Figma "Log expense"): scanned receipt hero with title
 * card, amount + paid-by/when fields, split segmented control, per-item
 * sharing with tap-to-exclude members.
 */
export default function LogExpense({ onClose, onSave }: Props) {
  const [items, setItems] = useState<ExpenseItem[]>(initialExpenseItems);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [swiped, setSwiped] = useState<string | null>(null);
  const [split, setSplit] = useState<SplitMode>("equal");
  const [amount, setAmount] = useState("123,50");
  const [draft, setDraft] = useState("");
  const dragging = useRef(false);

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setSwiped((s) => (s === id ? null : s));
    setExpanded((e) => (e === id ? null : e));
  }

  function toggleMember(itemId: string, memberId: string) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              excluded: it.excluded.includes(memberId)
                ? it.excluded.filter((m) => m !== memberId)
                : [...it.excluded, memberId],
            }
          : it,
      ),
    );
    // an uneven share is a custom split
    setSplit("custom");
  }

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, { id: `item-${itemSeq++}`, name: trimmed, price: "0,00", excluded: [] }]);
    setDraft("");
  }

  function shareLabel(item: ExpenseItem) {
    const included = expenseMembers.length - item.excluded.length;
    return item.excluded.length === 0 ? "everyone" : `${included} people`;
  }

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-ink flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: 0, transition: enterTransition }}
      exit={{ y: "100%", transition: exitTransition }}
    >
      {/* Header bar floats over the receipt photo (Figma: content starts at the status bar) */}
      <div className="absolute top-[env(safe-area-inset-top)] inset-x-0 z-10 flex items-center px-6 py-4">
        <IconButton symbol="chevronBackward" label="Back" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Content: 8px gutter, 32px between sections */}
        <div className="flex flex-col gap-8 px-2 pb-10 pt-[env(safe-area-inset-top)]">
          {/* Hero: receipt photo, title card overlaps it by 48px */}
          <div className="flex flex-col w-full">
            <div className="relative h-[162px] rounded-card overflow-hidden w-full mb-[-48px]">
              <img src={receipt} alt="" className="absolute inset-0 size-full object-cover" />
            </div>
            <div className="bg-surface rounded-card h-24 p-4 flex items-center gap-4 relative w-full overflow-hidden">
              <span className="size-16 bg-ink border border-ink rounded-pill flex items-center justify-center shrink-0 text-[24px]">
                🍕
              </span>
              <p className="text-[32px] font-medium leading-normal text-ink truncate">
                Dinner at Ramiro
              </p>
            </div>
          </div>

          {/* Amount row: currency picker + amount field */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={showUndesignedToast}
              className="bg-surface border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center shrink-0 cursor-pointer text-[24px] leading-normal"
            >
              <span className="text-ink">
                <SFSymbol name="euroSign" />{" "}
              </span>
              <span className="text-muted">
                <SFSymbol name="chevronUpDown" />
              </span>
            </button>
            <div className="border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center flex-1 min-w-0">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                aria-label="Amount"
                className="bg-transparent outline-none text-[24px] leading-normal text-white flex-1 min-w-0"
              />
            </div>
          </div>

          {/* Paid by / When + split segmented */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-1 w-full">
              <div className="flex flex-col gap-1 w-[148px] shrink-0">
                <p className="pl-4 text-[16px] leading-normal text-white">Paid By</p>
                <button
                  onClick={showUndesignedToast}
                  className="bg-surface border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center cursor-pointer text-[24px] leading-normal whitespace-nowrap"
                >
                  <span className="text-ink">Ari (you) </span>
                  <span className="text-muted">
                    <SFSymbol name="chevronUpDown" />
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="pl-4 text-[16px] leading-normal text-white">When?</p>
                <button
                  onClick={showUndesignedToast}
                  className="bg-surface border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center cursor-pointer text-[24px] leading-normal text-ink"
                >
                  27.06.2026
                </button>
              </div>
            </div>
            {/* Split segmented: active white pill slides over */}
            <div className="bg-ink border border-white rounded-pill h-[53px] flex w-full">
              {(
                [
                  { key: "equal", label: "Split equally" },
                  { key: "custom", label: "Custom" },
                  { key: "parts", label: "By parts" },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSplit(s.key)}
                  className="relative flex-1 rounded-pill p-4 text-[16px] leading-normal cursor-pointer flex items-center justify-center"
                >
                  {split === s.key && (
                    <motion.span
                      layoutId="split-active"
                      className="absolute inset-0 bg-surface rounded-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative transition-colors duration-300 whitespace-nowrap ${
                      split === s.key ? "text-ink font-medium" : "text-white"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2 w-full">
            <p className="pl-4 text-[16px] leading-normal text-white">
              Amounts by Items <SFSymbol name="chevronUpDown" className="text-muted" />
            </p>
            <div className="flex flex-col gap-1 w-full">
              <AnimatePresence initial={false}>
              {items.map((item) => {
                const isOpen = expanded === item.id;
                const isSwiped = swiped === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-full overflow-hidden shrink-0 rounded-card"
                  >
                    {/* Swipe-to-delete action revealed behind the row (Figma component state) */}
                    {!isOpen && (
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Delete ${item.name}`}
                        className="absolute right-0 top-[2px] size-[61px] rounded-full bg-danger flex items-center justify-center cursor-pointer active:brightness-90"
                        tabIndex={isSwiped ? 0 : -1}
                      >
                        <SFSymbol name="trash" className="font-light text-white text-[24px]" />
                      </button>
                    )}
                    <motion.div
                      className="bg-periwinkle rounded-card flex flex-col w-full overflow-hidden relative"
                      drag={isOpen ? false : "x"}
                      dragConstraints={{ left: -67, right: 0 }}
                      dragElastic={0.05}
                      animate={{ x: isSwiped && !isOpen ? -67 : 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 36 }}
                      onDragStart={() => {
                        dragging.current = true;
                      }}
                      onDragEnd={(_, info) => {
                        setSwiped(info.offset.x < -30 ? item.id : null);
                        setTimeout(() => {
                          dragging.current = false;
                        }, 50);
                      }}
                    >
                    <button
                      onClick={() => {
                        if (dragging.current) return;
                        if (isSwiped) {
                          setSwiped(null);
                          return;
                        }
                        setSwiped(null);
                        setExpanded(isOpen ? null : item.id);
                      }}
                      className={`flex items-center gap-2 pl-6 pr-4 w-full cursor-pointer text-left ${
                        isOpen ? "pt-4 pb-2" : "h-[65px] py-2"
                      }`}
                    >
                      {isOpen ? (
                        <span className="flex-1 min-w-0 text-[16px] font-medium leading-normal text-ink truncate">
                          {item.name}
                        </span>
                      ) : (
                        <span className="flex-1 min-w-0 flex flex-col items-start">
                          <span className="text-[16px] font-medium leading-normal text-ink truncate w-full">
                            {item.name}
                          </span>
                          <span className="text-[12px] leading-normal text-ink">{shareLabel(item)}</span>
                        </span>
                      )}
                      <span className="bg-ink rounded-pill px-4 py-2 shrink-0 text-[24px] font-medium leading-normal text-white whitespace-nowrap">
                        € {item.price}
                      </span>
                      <SFSymbol
                        name={isOpen ? "chevronUp" : "chevronDown"}
                        className="font-light text-ink text-[24px]"
                      />
                    </button>
                    {/* The detail card grows in height and pushes rows below down smoothly */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="w-full overflow-hidden"
                        >
                          {/* White detail card: 4px inset, radius 36, 1px ink border (updated component) */}
                          <div className="bg-surface border border-ink rounded-media px-6 py-4 flex flex-col gap-2 w-[calc(100%-8px)] mx-1 mb-1">
                            <div className="flex flex-col gap-0.5 text-ink">
                              <p className="text-[16px] font-medium leading-normal">who shared this?</p>
                              <p className="text-[12px] leading-normal">
                                Tap to add- or remove people from the list.
                              </p>
                            </div>
                            <div className="flex gap-2 items-start">
                              {expenseMembers.map((m) => {
                                const isExcluded = item.excluded.includes(m.id);
                                return (
                                  <button
                                    key={m.id}
                                    onClick={() => toggleMember(item.id, m.id)}
                                    aria-pressed={!isExcluded}
                                    aria-label={`${m.name} ${isExcluded ? "excluded" : "included"}`}
                                    className="flex flex-col gap-2 items-center cursor-pointer"
                                  >
                                    {isExcluded ? (
                                      <span className="size-10 rounded-full border border-dashed border-ink flex items-center justify-center text-ink text-[14px] font-bold">
                                        ✕
                                      </span>
                                    ) : m.avatar ? (
                                      <img
                                        src={m.avatar}
                                        alt=""
                                        className="size-10 rounded-full object-cover border border-ink"
                                      />
                                    ) : (
                                      <span className="size-10 rounded-full bg-peach border border-ink text-glass-label text-[24px] font-medium flex items-center justify-center">
                                        {m.name[0]}
                                      </span>
                                    )}
                                    <span className="text-[12px] leading-normal text-ink">{m.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
              {/* Add item row (Figma "Input field") */}
              <PillInput
                value={draft}
                onChange={setDraft}
                onSubmit={addItem}
                commitOnBlur
                placeholder="Add item"
                icon="pencil"
              />
            </div>
          </div>

          {/* Save: peach, 64px, radius 100, 1px black border */}
          <button
            onClick={onSave}
            className="w-full h-16 rounded-pill bg-peach border border-black px-4 py-2 text-[16px] font-medium leading-normal text-ink cursor-pointer active:brightness-95"
          >
            Save expense
          </button>
        </div>
      </div>
    </motion.div>
  );
}
