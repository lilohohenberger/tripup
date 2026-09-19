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
      {/* Header: tags + title, 24px left inset */}
      <div className="w-full pl-6 flex flex-col gap-1 justify-center">
        <div className="flex gap-0.5 items-start">
          <span className="border border-muted text-white text-[12px] leading-normal rounded-pill px-2 py-1">
            {votedCount(poll)}/{poll.totalMembers} have voted
          </span>
          <span className="border border-muted text-white text-[12px] leading-normal rounded-pill px-2 py-1">
            <SFSymbol name="circleFill" className="text-peach" /> {poll.minutesRemaining} mins
            remaining
          </span>
        </div>
        <p className="text-[24px] font-medium leading-normal text-white">
          Cast your vote for
          <br />“{poll.question}”
        </p>
        {poll.description && (
          <p className="text-[16px] leading-normal text-white">{poll.description}</p>
        )}
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
                  onClick={() => toggle(o.id)}
                  className="bg-surface rounded-pill p-2 flex items-center gap-2 flex-1 min-w-0 cursor-pointer active:brightness-95"
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
                {/* Checkbox: empty while unchecked, white box with ink check when checked */}
                <button
                  onClick={() => toggle(o.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`Vote for ${o.label}`}
                  className={`size-8 rounded-[4px] border border-white shrink-0 cursor-pointer flex items-center justify-center transition-colors ${
                    isSelected ? "bg-surface" : "bg-ink"
                  }`}
                >
                  {isSelected && (
                    <SFSymbol name="checkmark" className="text-[12px] font-medium text-ink" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="w-full flex flex-col gap-2 items-center">
          {/* Add option row (Figma "Input field") */}
          <PillInput
            value={draft}
            onChange={setDraft}
            onSubmit={addOption}
            placeholder="Add option"
            icon="pencil"
          />
          <p className="w-full pl-6 text-[12px] leading-normal text-muted">
            Whatever option wins this poll will automatically be added to the itinerary.
          </p>
        </div>
      </div>

      {/* Save vote: 64px pill, 1px black border; peach when active, #949494 while empty */}
      <button
        onClick={() => {
          onSaveVote(selected);
          setSelected([]);
        }}
        disabled={selected.length === 0}
        className={`w-full h-16 rounded-pill border border-black px-4 py-2 text-[16px] font-medium leading-normal transition-colors ${
          selected.length > 0
            ? "bg-peach text-ink cursor-pointer active:brightness-95"
            : "bg-muted text-[#2c2c2c] cursor-default"
        }`}
      >
        Save vote
      </button>
    </BottomSheet>
  );
}
