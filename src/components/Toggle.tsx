type Props = {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
};

/**
 * Switch from the hi-fi create screen: 80×40, periwinkle track when on,
 * 36px white knob with 1px ink border (2px inset).
 */
export default function Toggle({ on, onChange, label }: Props) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative w-20 h-10 rounded-pill transition-colors duration-200 cursor-pointer shrink-0 ${
        on ? "bg-periwinkle" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-[2px] block size-9 rounded-full bg-surface border border-ink transition-[left] duration-200 ${
          on ? "left-[42px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
