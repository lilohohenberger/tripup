import SFSymbol from "./SFSymbol";

type Props = {
  images: string[];
  size?: 40 | 32;
  /** Extra letter avatar (e.g. Ren's claimable profile) rendered after the photos. */
  letter?: string;
  onAdd?: () => void;
  /** Render the ink plus circle without its own click target (e.g. inside a clickable card). */
  staticAdd?: boolean;
};

/**
 * Overlapping avatars (−16px overlap, from Figma "Member Avatars").
 * Letter avatar: peach with 1px ink border; add button: ink circle with plus,
 * overlapping the previous avatar like the rest of the stack.
 */
export default function AvatarStack({ images, size = 40, letter, onAdd, staticAdd }: Props) {
  return (
    <div className="flex items-start">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          width={size}
          height={size}
          className="rounded-full shrink-0 -mr-4 object-cover border border-ink"
          style={{ width: size, height: size }}
        />
      ))}
      {letter && (
        <span
          className="rounded-full shrink-0 -mr-4 bg-peach border border-ink text-glass-label font-medium flex items-center justify-center"
          style={{ width: size, height: size, fontSize: size * 0.6 }}
        >
          {letter}
        </span>
      )}
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-ink text-white rounded-full flex items-center justify-center shrink-0 cursor-pointer active:bg-surface active:text-ink transition-colors"
          style={{ width: size, height: size }}
          aria-label="Add someone to the trip"
        >
          <SFSymbol name="plus" className="text-[16px] font-light leading-none" />
        </button>
      )}
      {!onAdd && staticAdd && (
        <span
          className="bg-ink text-white rounded-full flex items-center justify-center shrink-0"
          style={{ width: size, height: size }}
        >
          <SFSymbol name="plus" className="text-[16px] font-light leading-none" />
        </span>
      )}
    </div>
  );
}
