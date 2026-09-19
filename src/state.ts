import avatarS1 from "./assets/avatar-s1.png";
import avatarS2 from "./assets/avatar-s2.png";
import avatarS3 from "./assets/avatar-s3.png";
import thumbPizza from "./assets/thumb-pizza.png";
import thumbFancy from "./assets/thumb-fancy.png";

export type PollOption = {
  id: string;
  label: string;
  place?: string;
  image?: string; // undefined → gradient placeholder
  voters: string[]; // avatar image urls (or "R" for Ren)
};

export type Poll = {
  question: string;
  description?: string;
  options: PollOption[];
  allowMultiple: boolean;
  /** "Allow others to add options?" — hides the add-option input while voting. */
  allowAddOptions: boolean;
  deadlineLabel: string;
  minutesRemaining: number;
  myVotes: string[];
  totalMembers: number;
  /** Set once my vote is in — the poll flips to its decided state. */
  decided?: boolean;
};

export type Sheet = null | "addMember" | "fab" | "create" | "vote" | "camera" | "expense";

/** Preset imagery so the demo poll matches the hi-fi design. */
export function imageForOption(label: string): string | undefined {
  const l = label.toLowerCase();
  if (l.includes("pizza")) return thumbPizza;
  if (l.includes("fancy")) return thumbFancy;
  return undefined;
}

export function placeForOption(label: string): string | undefined {
  const l = label.toLowerCase();
  if (l.includes("pizza")) return "Pizzeria Ramiro";
  if (l.includes("fancy")) return "Alma";
  return undefined;
}

export function votedCount(poll: Poll): number {
  // My own saved vote is already represented by my avatar inside `voters`.
  const voters = new Set<string>();
  poll.options.forEach((o) => o.voters.forEach((v) => voters.add(v)));
  return voters.size;
}

/** Friends vote one after another so the live reorder animation shows. */
export const simulatedVotes: { delayMs: number; avatar: string; optionIndex: number }[] = [
  { delayMs: 3500, avatar: avatarS1, optionIndex: 1 },
  { delayMs: 8000, avatar: avatarS2, optionIndex: 1 },
  { delayMs: 13000, avatar: avatarS3, optionIndex: 0 },
];
