import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomSheet from "../components/BottomSheet";
import PillInput from "../components/PillInput";
import SFSymbol from "../components/SFSymbol";
import avatarMe from "../assets/avatar-1.png";
import thumbGradient from "../assets/thumb-gradient.svg";
import { imageForOption, placeForOption, votedCount, type Poll, type PollOption } from "../state";

type Props = {
  open: boolean;
  poll: Poll | null;
  onClose: () => void;
  onSaveVote: (optionIds: string[]) => void;
  onAddOption: (option: PollOption) => void;
};

let voteOptionSeq = 100;

export default function VoteSheet({ open, poll, onClose, onSaveVote, onAddOption }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  // Live ranking: most popular first (my pending selection counts toward the preview).
  const ranked = useMemo(() => {
    if (!poll) return [];
    return [...poll.options].sort((a, b) => {
      const va = a.voters.length + (selected.includes(a.id) ? 1 : 0);
      const vb = b.voters.length + (selected.includes(b.id) ? 1 : 0);
      return vb - va;
    });
  }, [poll, selected]);

  if (!poll) return null;
  /** Decided polls open in their results state (Figma "Results for ..."). */
  const results = !!poll.decided;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      return poll!.allowMultiple ? [...prev, id] : [id];
    });
  }

  function addOption() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddOption({
      id: `opt-${voteOptionSeq++}`,
      label: trimmed,
      place: placeForOption(trimmed),
      image: imageForOption(trimmed),
      voters: [],
    });
    setDraft("");
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Header: title + description (8px inset), tag chips underneath */}
      <div className="w-full px-2 flex flex-col gap-1 justify-center text-white">
        <p className="text-[24px] font-medium leading-normal">
          {results ? <>Results for “{poll.question}”</> : <>Cast your vote for “{poll.question}”</>}
        </p>
        {poll.description && <p className="text-[16px] leading-normal">{poll.description}</p>}
      </div>
      <div className="w-full flex gap-0.5 items-start">
        <span className="border border-muted text-white text-[12px] leading-normal rounded-pill px-2 py-1">
          {votedCount(poll)}/{poll.totalMembers} have voted
        </span>
        <span className="border border-muted text-white text-[12px] leading-normal rounded-pill pl-1 pr-2 py-1 flex items-center gap-1">
          {results ? (
            <>
              <SFSymbol name="circleFill" className="text-periwinkle" /> Poll closed
            </>
          ) : (
            <>
              <SFSymbol name="circleFill" className="text-peach" /> {poll.minutesRemaining} mins
              remaining
            </>
          )}
        </span>
      </div>

      <div className="w-full flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {ranked.map((o) => {
            const isSelected = selected.includes(o.id);
            return (
              <motion.div
                key={o.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="flex items-center gap-2 w-full"
              >
                {/* Option pill: white, radius 100, 8px padding, 55px thumbnail */}
                <button
                  onClick={results ? undefined : () => toggle(o.id)}
                  className={`bg-surface rounded-pill p-2 flex items-center gap-2 flex-1 min-w-0 ${
                    results ? "cursor-default" : "cursor-pointer active:brightness-95"
                  }`}
                >
                  <img
                    src={o.image ?? thumbGradient}
                    alt=""
                    className="size-[58px] rounded-full object-cover shrink-0"
                  />
                  <span className="flex-1 min-w-0 flex flex-col gap-1 items-start text-left">
                    <span className="text-[16px] font-medium leading-normal text-ink truncate w-full">
                      {o.label}
                    </span>
                    {o.place && (
                      <span className="border border-black text-ink text-[12px] leading-normal rounded-pill px-2 py-1">
                        @ {o.place} <SFSymbol name="arrowUpRight" className="font-light" />
                      </span>
                    )}
                  </span>
                  {/* Voter avatars: 40px, −16px overlap */}
                  <span className="flex shrink-0 items-start">
                    {o.voters.map((v, i) =>
                      v === "R" ? (
                        <span
                          key={i}
                          className="size-10 rounded-full bg-peach border border-ink text-glass-label text-[24px] font-medium flex items-center justify-center -mr-4 last:mr-0 shrink-0"
                        >
                          R
                        </span>
                      ) : (
                        <img
                          key={i}
                          src={v}
                          alt=""
                          className="size-10 rounded-full object-cover border border-ink -mr-4 last:mr-0 shrink-0"
                        />
                      ),
                    )}
                    {isSelected && (
                      <img
                        src={avatarMe}
                        alt="Your vote"
                        className="size-10 rounded-full object-cover border border-ink shrink-0"
                      />
                    )}
                  </span>
                </button>
                {/* Checkbox (multiple votes) or radio (single vote), Figma "Checkbox":
                    empty while unchecked; checked = white box with ink check /
                    ink circle with white dot */}
                {!results && (
                <button
                  onClick={() => toggle(o.id)}
                  role={poll!.allowMultiple ? "checkbox" : "radio"}
                  aria-checked={isSelected}
                  aria-label={`Vote for ${o.label}`}
                  className={`size-8 border border-white shrink-0 cursor-pointer flex items-center justify-center transition-colors ${
                    poll!.allowMultiple
                      ? `rounded-[4px] ${isSelected ? "bg-surface" : "bg-ink"}`
                      : "rounded-pill bg-ink"
                  }`}
                >
                  {isSelected &&
                    (poll!.allowMultiple ? (
                      <SFSymbol name="checkmark" className="text-[12px] font-medium text-ink" />
                    ) : (
                      /* 16px type renders the ~20px dot from the Figma component */
                      <SFSymbol name="circleFill" className="text-[16px] font-light text-white" />
                    ))}
                </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add option row (Figma "Input field") — only while voting is open */}
        {!results && poll.allowAddOptions && (
          <PillInput
            value={draft}
            onChange={setDraft}
            onSubmit={addOption}
            placeholder="Add another option..."
          />
        )}
      </div>

      {!results && (
        <p className="w-full px-2 text-[12px] leading-normal text-muted">
          Whatever option wins this poll will automatically be added to the itinerary.
        </p>
      )}

      {/* Save vote: 64px pill, 1px black border; peach when active, #949494 while empty */}
      {results ? (
        /* secondary action on the results sheet (Figma 2141:45125) */
        <button
          onClick={onClose}
          className="border border-white rounded-card px-6 py-4 flex items-center justify-center gap-2 w-full cursor-pointer text-white active:bg-surface active:text-ink transition-colors"
        >
          <SFSymbol name="arrowLeft" className="text-[24px] font-light leading-normal" />
          <span className="min-w-0 truncate text-[24px] font-medium leading-normal">
            Back to overview
          </span>
        </button>
      ) : (
        <button
          onClick={() => {
            onSaveVote(selected);
            setSelected([]);
          }}
          disabled={selected.length === 0}
          className={`w-full h-16 rounded-pill border border-black px-4 py-2 text-[24px] font-medium leading-normal transition-colors ${
            selected.length > 0
              ? "bg-peach text-ink cursor-pointer active:brightness-95"
              : "bg-muted text-[#2c2c2c] cursor-default"
          }`}
        >
          Save vote
        </button>
      )}
    </BottomSheet>
  );
}
