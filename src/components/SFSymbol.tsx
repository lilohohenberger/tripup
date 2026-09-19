import type { CSSProperties } from "react";
import { LIGHT, MEDIUM, REGULAR, THIN, SYMBOL_UPM } from "./sfSymbolPaths";

/**
 * SF Symbols from the Figma designs, rendered as inline SVG outlines
 * (extracted from the SF Pro font) so they look identical in every browser
 * and on every OS. Sized in em like text; colored via currentColor.
 * Icon-button glyphs use the Light (274) cut, matching the designs.
 */
export type SymbolName = keyof typeof REGULAR;

type Props = {
  name: SymbolName;
  className?: string;
  style?: CSSProperties;
};

export default function SFSymbol({ name, className, style }: Props) {
  const thin = className?.includes("font-thin") ?? false;
  const light = className?.includes("font-light") ?? false;
  const medium = className?.includes("font-medium") ?? false;
  const glyph =
    (thin ? (THIN as Partial<typeof REGULAR>)[name] : undefined) ??
    (medium ? (MEDIUM as Partial<typeof REGULAR>)[name] : undefined) ??
    (light || thin ? LIGHT : REGULAR)[name];
  const [x0, y0, x1, y1] = glyph.box;
  const w = x1 - x0;
  const h = y1 - y0;
  return (
    <svg
      aria-hidden
      className={className}
      viewBox={`${x0} ${y0} ${w} ${h}`}
      fill="currentColor"
      style={{
        display: "inline-block",
        width: `${w / SYMBOL_UPM}em`,
        height: `${h / SYMBOL_UPM}em`,
        verticalAlign: `${-y1 / SYMBOL_UPM}em`,
        ...style,
      }}
    >
      <path d={glyph.d} />
    </svg>
  );
}
