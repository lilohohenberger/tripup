import TagChip from "./TagChip";
import type { Idea } from "../data/trip";

/**
 * Group idea tile (Figma "Idea Card"): periwinkle, radius 40, 4px top/side
 * padding; image r36 with inner shadow, tag chip top-left, 32px avatar stack
 * bottom-right; caption 16 Medium + "Added by X" 12 Regular.
 */
export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="bg-periwinkle rounded-card overflow-hidden flex flex-col px-1 pt-1 self-start">
      <div className="relative h-[130px] rounded-media overflow-hidden shrink-0 w-full">
        <img src={idea.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 rounded-media shadow-media-inset pointer-events-none" />
        <div className="absolute left-[10px] top-2">
          <TagChip label={idea.tag} />
        </div>
        <div className="absolute right-[10px] bottom-[9px] flex">
          {idea.voters.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="size-8 rounded-full -mr-4 last:mr-0 object-cover"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-0.5 px-2 pt-4 pb-6 text-ink">
        <p className="text-[16px] font-medium leading-normal">{idea.title}</p>
        <p className="text-[12px] leading-normal truncate">{idea.addedBy}</p>
      </div>
    </div>
  );
}
