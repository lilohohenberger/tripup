import { useState } from "react";
import BottomSheet from "../components/BottomSheet";
import PillInput from "../components/PillInput";
import SFSymbol from "../components/SFSymbol";
import { shareInviteLink } from "../lib/share";
import { trip } from "../data/trip";

type Props = {
  open: boolean;
  onClose: () => void;
  onAddByName: (name: string) => void;
};

export default function AddMemberSheet({ open, onClose, onAddByName }: Props) {
  const [name, setName] = useState("");
  const [shareState, setShareState] = useState<null | "copied">(null);

  async function handleShare() {
    const result = await shareInviteLink(trip.name, "https://tripup.app/j/portu-gaaals");
    if (result === "copied") {
      setShareState("copied");
      setTimeout(() => setShareState(null), 2000);
    }
  }

  function submitName() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddByName(trimmed);
    setName("");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Title: 24 Medium, 24px left inset */}
      <p className="w-full pl-6 text-[24px] font-medium leading-normal text-white">
        Add someone to
        <br />
        {trip.name}
      </p>
      <div className="w-full flex flex-col gap-1">
        {/* Share row: white card, radius 40, 1px black border, 24×16 padding, 24 Medium */}
        <button
          onClick={handleShare}
          className="bg-surface border border-black rounded-card px-6 py-4 flex items-start gap-2 w-full cursor-pointer text-ink active:bg-ink active:text-white transition-colors"
        >
          <SFSymbol name="link" className="text-[24px] leading-normal" />
          <span className="flex-1 min-w-0 text-left text-[24px] font-medium leading-normal">
            {shareState === "copied" ? "Link copied!" : "Share invite Link"}
          </span>
        </button>
        <div className="w-full flex flex-col gap-2 items-center">
          {/* Name row (Figma "Input field") */}
          <PillInput
            value={name}
            onChange={setName}
            onSubmit={submitName}
            placeholder="Add by name"
            icon="pencil"
          />
          <p className="w-full pl-6 text-[12px] leading-normal text-muted">
            They&rsquo;ll count in plans and expenses right away, no app needed. The profile can be
            claimed later.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
