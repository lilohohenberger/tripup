/**
 * SF Symbols, rendered as the actual glyph code points used in the Figma file.
 * They resolve through the system SF Pro font on Apple devices (iOS/macOS),
 * which is where this prototype is meant to be demoed.
 * Icon-button glyphs are set in SF Pro Light (274) in the design.
 */
const GLYPHS = {
  plus: "\u{10017C}", // 􀅼
  calendar: "\u{100249}", // 􀉉
  arrowUpRight: "\u{10012F}", // 􀄯
  location: "\u{1002D1}", // 􀋑
  chevronBackward: "\u{100BF6}", // 􀯶
  pencil: "\u{10020A}", // 􀈊
  house: "\u{10039E}", // 􀎞
  banknote: "\u{1013A2}", // 􁎢
  xmark: "\u{100184}", // 􀆄
  checkmark: "\u{100185}", // 􀆅
  link: "\u{100263}", // 􀉣
  plusCircle: "\u{10004C}", // 􀁌
  chevronUpDown: "\u{10018F}", // 􀆏
  chartBar: "\u{10043E}", // 􀐾
  circleFill: "\u{100001}", // 􀀁
  lightbulb: "\u{1006ED}", // 􀛭
  euroBanknote: "\u{10221A}", // 􂈚
  magnifyingglass: "\u{1002AB}", // 􀊫
  clock: "\u{10042B}", // 􀐫
  photo: "\u{1003C5}", // 􀏅
  rectAndPencil: "\u{10020F}", // 􀈏
  euroSign: "\u{101447}", // eurosign
  chevronUp: "\u{100187}", // 􀆇
  chevronDown: "\u{100188}", // 􀆈
  trash: "\u{100211}", // 􀈑
  handThumbsup: "\u{10027F}", // 􀉿
  checkmarkSeal: "\u{1001FB}", // checkmark.seal.fill
  arrowLeft: "\u{10012A}", // 􀄪
  enterKey: "\u{100147}", // submit arrow (Input field "Active filled")
  bell: "\u{1002D9}", // 􀋙
} as const;

export type SymbolName = keyof typeof GLYPHS;

type Props = {
  name: SymbolName;
  className?: string;
  style?: React.CSSProperties;
};

export default function SFSymbol({ name, className, style }: Props) {
  return (
    <span aria-hidden className={className} style={style}>
      {GLYPHS[name]}
    </span>
  );
}
