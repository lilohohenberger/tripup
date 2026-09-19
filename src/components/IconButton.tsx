import SFSymbol, { type SymbolName } from "./SFSymbol";

type Props = {
  symbol: SymbolName;
  label: string;
  onClick?: () => void;
  /** Header buttons use 17px glyphs, the menu-bar plus 16px (from Figma). */
  glyphSize?: 17 | 16;
};

/**
 * 48px white circle, 1px ink border, SF Pro Light glyph (Figma "Icon Button").
 * Pressed/Active state inverts: ink background, white glyph.
 */
export default function IconButton({ symbol, label, onClick, glyphSize = 17 }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="group size-12 bg-surface border border-ink rounded-pill flex items-center justify-center shrink-0 cursor-pointer active:bg-ink"
    >
      <SFSymbol
        name={symbol}
        className="font-light text-glass-label leading-none group-active:text-white"
        style={{ fontSize: glyphSize }}
      />
    </button>
  );
}
