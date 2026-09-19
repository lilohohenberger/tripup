import SFSymbol, { type SymbolName } from "./SFSymbol";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  /** Leading glyph; hides while typing (kept from the earlier interaction spec). */
  icon?: SymbolName;
  /** Commit the value when focus leaves the field (used by the option inputs). */
  commitOnBlur?: boolean;
};

/**
 * 62px pill input (Figma "Input field"): #949494 border while empty; once
 * filled the border turns white and a 48px white enter button appears on the
 * right ("Active filled" state).
 */
export default function PillInput({ value, onChange, onSubmit, placeholder, icon, commitOnBlur }: Props) {
  const filled = value.trim() !== "";
  return (
    <form
      className={`group rounded-pill h-[62px] pl-4 flex items-center gap-2 w-full border ${
        filled ? "border-white pr-2" : "border-muted pr-4"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {icon && (
        <SFSymbol
          name={icon}
          className={`text-[24px] text-muted leading-normal group-focus-within:hidden ${
            value ? "hidden" : ""
          }`}
        />
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={commitOnBlur ? onSubmit : undefined}
        enterKeyHint="done"
        placeholder={placeholder}
        className="bg-transparent outline-none text-[24px] leading-normal text-white placeholder:text-muted flex-1 min-w-0"
      />
      {filled && (
        <button
          type="submit"
          aria-label="Confirm"
          className="group/enter size-12 bg-surface border border-ink rounded-pill flex items-center justify-center shrink-0 cursor-pointer active:bg-ink"
        >
          <SFSymbol
            name="enterKey"
            className="font-light text-ink text-[16px] leading-none group-active/enter:text-white"
          />
        </button>
      )}
    </form>
  );
}
