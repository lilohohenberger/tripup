import type { ReactNode } from "react";

type Props = {
  variant: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
};

/** Action pill — 40px tall, radius 100, padding 16×8, SF Pro Regular 16 (Figma "Pill Button"). */
export default function PillButton({ variant, children, onClick }: Props) {
  const styles =
    variant === "primary"
      ? "bg-ink text-white active:bg-surface active:text-ink"
      : "bg-surface text-ink border border-black active:bg-ink active:text-white";
  return (
    <button
      onClick={onClick}
      className={`${styles} h-10 rounded-pill px-4 py-2 text-[16px] leading-normal cursor-pointer transition-colors`}
    >
      {children}
    </button>
  );
}
