/** Category chip on imagery — white pill, 1px black border, 12 Regular (from Figma "Tag Chip"). */
export default function TagChip({ label }: { label: string }) {
  return (
    <span className="bg-surface text-ink border border-black rounded-pill px-2 py-1 text-[12px] leading-normal">
      {label}
    </span>
  );
}
