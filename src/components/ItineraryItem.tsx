import SFSymbol from "./SFSymbol";
import type { ItineraryEntry } from "../data/trip";

/**
 * Timeline entry (Figma "Itinerary Item"): white card, 1px black border,
 * radius 40, padding 24×16; title 16 Medium, address 12 with location glyph,
 * times 16 Medium.
 */
export default function ItineraryItem({ entry }: { entry: ItineraryEntry }) {
  return (
    <div className="bg-surface border border-black rounded-card w-full flex gap-2 items-start px-6 py-4 text-ink overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className="text-[16px] font-medium leading-normal">{entry.title}</p>
        <p className="text-[12px] leading-normal truncate">
          <SFSymbol name="location" /> {entry.address}
        </p>
      </div>
      <div className="flex flex-col gap-0.5 text-[16px] font-medium leading-normal shrink-0">
        <p>{entry.start}</p>
        <p>{entry.end}</p>
      </div>
    </div>
  );
}
