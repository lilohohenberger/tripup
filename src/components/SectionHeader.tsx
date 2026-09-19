import SFSymbol from "./SFSymbol";

type Props = {
  title: string;
  onOpen?: () => void;
};

/** Section row — label 16 Regular white + arrow.up.right button (Figma "Section Header"). */
export default function SectionHeader({ title, onOpen }: Props) {
  return (
    <div className="flex items-center w-full">
      <p className="flex-1 text-[16px] text-white leading-normal">{title}</p>
      <button
        onClick={onOpen}
        className="rounded-pill text-white cursor-pointer active:opacity-80"
        aria-label={`Open ${title}`}
      >
        <SFSymbol name="arrowUpRight" className="text-[17px]" />
      </button>
    </div>
  );
}
