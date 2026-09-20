import { useState } from "react";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import MenuBar from "../components/MenuBar";
import BottomSheet from "../components/BottomSheet";
import SlidePill from "../components/SlidePill";
import paypal from "../assets/paypal.png";
import { expenseSummary, expenseGroups, balances } from "../data/balances";

type Props = {
  onHome: () => void;
  onLogExpense: () => void;
  /** Tapping an existing expense opens the add/edit expense screen. */
  onOpenExpense: () => void;
};

type Tab = "expenses" | "balances";
type SettleSheet = null | "settle" | "done";

/**
 * Expenses / Balances tab screens (Figma "Expenses – List", "Balances –
 * Overview", "Settle Up", "Squared Up Confirmation", "All Settled").
 */
export default function ExpensesTab({ onHome, onLogExpense, onOpenExpense }: Props) {
  const [tab, setTab] = useState<Tab>("expenses");
  const [sheet, setSheet] = useState<SettleSheet>(null);
  const [settled, setSettled] = useState(false);

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto overscroll-contain">
        {/* Header bar: back only (the menu-bar plus logs expenses) */}
        <div className="flex items-center px-6 py-4 pt-[max(16px,env(safe-area-inset-top))]">
          <IconButton symbol="chevronBackward" label="Back" onClick={onHome} />
        </div>

        {/* Content: 8px gutter, 16px between sections */}
        <div className="flex flex-col gap-4 px-2 pb-24">
          {/* Tab bar: active white pill slides over */}
          <div className="bg-ink border border-white rounded-pill flex w-full">
            {(
              [
                { key: "expenses", label: "Expenses" },
                { key: "balances", label: "Balances" },
              ] as const
            ).map((t, i) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="relative flex-1 rounded-pill p-4 text-[16px] leading-normal cursor-pointer flex items-center justify-center"
              >
                {tab === t.key && (
                  <SlidePill
                    layoutId="expenses-tab-active"
                    index={i}
                    count={2}
                    onSelect={(target) => setTab(target === 0 ? "expenses" : "balances")}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span
                  className={`relative transition-colors duration-300 pointer-events-none ${
                    tab === t.key ? "text-ink font-medium" : "text-white"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          {tab === "expenses" ? (
            <>
              {/* Summary: transparent, white text, 24px inset */}
              <div className="px-6 flex items-center justify-between w-full">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[16px] leading-normal text-white">My expenses</p>
                  <p className="text-[24px] font-medium leading-normal text-white">
                    {expenseSummary.mine}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5 items-end">
                  <p className="text-[16px] leading-normal text-white">Total</p>
                  <p className="text-[24px] font-medium leading-normal text-white">
                    {expenseSummary.total}
                  </p>
                </div>
              </div>
              {/* Date-grouped expenses */}
              {expenseGroups.map((g) => (
                <div key={g.date} className="flex flex-col gap-0.5 w-full">
                  <div className="h-[29px] flex items-center px-6 w-full">
                    <p className="text-[16px] leading-normal text-white">{g.date}</p>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    {g.entries.map((e) => (
                      <button
                        key={e.title}
                        onClick={onOpenExpense}
                        className="bg-periwinkle rounded-card pl-2 pr-4 py-2 flex items-center gap-2 w-full cursor-pointer text-left"
                      >
                        <span className="size-12 bg-ink rounded-pill flex items-center justify-center shrink-0 text-[20px]">
                          {e.emoji}
                        </span>
                        <span className="flex-1 min-w-0 flex flex-col">
                          <span className="text-[16px] font-medium leading-normal text-ink truncate">
                            {e.title}
                          </span>
                          <span className="text-[12px] leading-normal text-ink truncate">
                            {e.paidBy}
                          </span>
                        </span>
                        <span className="text-[16px] font-medium leading-normal text-ink shrink-0">
                          {e.amount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Settle card: peach while owing, white once squared up */}
              {settled ? (
                <div className="bg-surface rounded-card p-6 flex items-center justify-between gap-4 w-full">
                  <div className="flex flex-col gap-0.5 text-ink min-w-0">
                    <p className="text-[24px] font-medium leading-normal">All squared up!</p>
                    <p className="text-[16px] leading-normal">No debts to be paid. Good job!</p>
                  </div>
                </div>
              ) : (
                <div className="bg-peach rounded-card p-6 flex items-center justify-between gap-4 w-full">
                  <div className="flex flex-col gap-0.5 text-ink min-w-0">
                    <p className="text-[24px] font-medium leading-normal">You owe € 59,33</p>
                    <p className="text-[16px] leading-normal">to Tom</p>
                  </div>
                  <button
                    onClick={() => setSheet("settle")}
                    className="bg-ink text-white rounded-pill h-10 px-4 py-2 text-[16px] leading-normal shrink-0 cursor-pointer active:bg-surface active:text-ink transition-colors"
                  >
                    Settle up
                  </button>
                </div>
              )}
              {/* Balances list */}
              <div className="flex flex-col gap-0.5 w-full">
                <div className="h-[29px] flex items-center px-6 w-full">
                  <p className="text-[16px] leading-normal text-white">Balances</p>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  {balances.map((b) => {
                    const amount = settled && b.settledAmount ? b.settledAmount : b.amount;
                    const positive = settled && b.settledAmount ? true : b.positive;
                    return (
                      <div key={b.name} className="px-6 py-2 flex items-center gap-2 w-full">
                        {b.avatar ? (
                          <img
                            src={b.avatar}
                            alt=""
                            className="size-10 rounded-full object-cover border border-white shrink-0"
                          />
                        ) : (
                          <span className="size-10 rounded-full bg-peach border border-white text-glass-label text-[24px] font-medium flex items-center justify-center shrink-0">
                            {b.name[0]}
                          </span>
                        )}
                        <span className="flex-1 min-w-0 flex flex-col">
                          <span className="text-[16px] font-medium leading-normal text-white truncate">
                            {b.name}
                          </span>
                          {b.you && <span className="text-[12px] leading-normal text-muted">you</span>}
                        </span>
                        <span
                          className={`text-[24px] font-medium leading-normal shrink-0 ${
                            positive ? "text-white" : "text-peach"
                          }`}
                        >
                          {amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <MenuBar active="expenses" onHome={onHome} onAdd={onLogExpense} />

      {/* Settle up sheet */}
      <BottomSheet open={sheet === "settle"} onClose={() => setSheet(null)}>
        <p className="w-full pl-6 text-[24px] font-medium leading-normal text-white">
          You owe 59,33 to Tom
        </p>
        <div className="w-full flex flex-col gap-1">
          <button
            onClick={() => {
              setSettled(true);
              setSheet("done");
            }}
            className="bg-surface border border-black rounded-card px-6 py-4 flex items-center justify-center gap-2 w-full cursor-pointer text-ink active:bg-ink active:text-white transition-colors"
          >
            <img src={paypal} alt="" className="h-[29px] w-auto shrink-0" />
            <span className="min-w-0 truncate text-[24px] font-medium leading-normal">
              Settle with PayPal
            </span>
          </button>
          <button
            onClick={() => {
              setSettled(true);
              setSheet("done");
            }}
            className="border border-white rounded-card px-6 py-4 flex items-center justify-center gap-2 w-full cursor-pointer text-white active:bg-surface active:text-ink transition-colors"
          >
            <SFSymbol name="handThumbsup" className="text-[24px] font-light leading-normal" />
            <span className="min-w-0 truncate text-[24px] font-medium leading-normal">
              Mark as paid
            </span>
          </button>
        </div>
      </BottomSheet>

      {/* Squared up confirmation sheet */}
      <BottomSheet open={sheet === "done"} onClose={() => setSheet(null)}>
        <div className="w-full pl-6 flex items-center gap-2.5">
          <SFSymbol name="checkmarkSeal" className="text-[24px] font-light text-white leading-normal" />
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <p className="text-[24px] font-medium leading-normal text-white">All squared up!</p>
            <p className="text-[16px] leading-normal text-white">All your debts are settled. Great!</p>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <button
            onClick={() => setSheet(null)}
            className="bg-surface border border-black rounded-card px-6 py-4 flex items-center justify-center gap-2 w-full cursor-pointer text-ink active:bg-ink active:text-white transition-colors"
          >
            <SFSymbol name="arrowLeft" className="text-[24px] font-light leading-normal" />
            <span className="min-w-0 truncate text-[24px] font-medium leading-normal">
              Back to overview
            </span>
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
