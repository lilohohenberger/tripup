type Props = {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
};

/**
 * Switch from the hi-fi create screen: 80×40, periwinkle track when on,
 * ink track with 1px white border when off; 36px white knob, 1px ink border.
 */
export default function Toggle({ on, onChange, label }: Props) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative w-20 h-10 rounded-pill transition-colors duration-200 cursor-pointer shrink-0 box-border ${
        on ? "bg-periwinkle" : "bg-ink border border-white"
      }`}
    >
      {/* off: the 1px track border shifts the inner origin, so 1px keeps the
          knob visually 2px from the component edge like the on state */}
      <span
        className={`absolute block size-9 rounded-full bg-surface border border-ink transition-[left] duration-200 ${
          on ? "top-[2px] left-[42px]" : "top-[1px] left-[1px]"
        }`}
      />
    </button>
  );
}
