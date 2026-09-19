import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  headline: string;
  actions?: ReactNode;
};

/** Dashboard nudge (from Figma "Prompt Card"): peach, radius 40, padding 24, gap 16. */
export default function PromptCard({ eyebrow, headline, actions }: Props) {
  return (
    <div className="bg-peach rounded-card p-6 flex flex-col gap-4 w-full overflow-hidden">
      <div className="flex flex-col gap-0.5 text-ink">
        <p className="text-[16px] leading-normal">{eyebrow}</p>
        <p className="text-[24px] font-medium leading-normal">{headline}</p>
      </div>
      {actions && <div className="flex items-center gap-0.5">{actions}</div>}
    </div>
  );
}
