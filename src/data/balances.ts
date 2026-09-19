import memberAri from "../assets/member-ari.png";
import memberLena from "../assets/member-lena.png";
import memberTom from "../assets/member-tom.png";
import memberMia from "../assets/member-mia.png";
import avatar5 from "../assets/avatar-5.png";

/** Expenses tab content (from the hi-fi "Expenses – List" screen). */
export const expenseSummary = { mine: "€ 843,50", total: "€ 1.097,00" };

export type ExpenseEntry = { emoji: string; title: string; paidBy: string; amount: string };
export type ExpenseGroup = { date: string; entries: ExpenseEntry[] };

export const expenseGroups: ExpenseGroup[] = [
  {
    date: "26.06.2026",
    entries: [{ emoji: "🍕", title: "Dinner at Cervejaria Ramiro", paidBy: "Paid by Ari", amount: "€ 123,50" }],
  },
  {
    date: "25.06.2026",
    entries: [
      { emoji: "🚋", title: "Tram 28 day passes", paidBy: "Paid by Nic", amount: "€ 19,20" },
      { emoji: "🧺", title: "Picnic groceries", paidBy: "Paid by Lena", amount: "€ 54,30" },
    ],
  },
  {
    date: "24.06.2026",
    entries: [{ emoji: "⛵", title: "Sunset sail on the Tejo", paidBy: "Paid by Tom", amount: "€ 180,00" }],
  },
  {
    date: "21.06.2026",
    entries: [{ emoji: "🏠", title: "Airbnb Alfama · 6 nights", paidBy: "Paid by Ari", amount: "€ 720,00" }],
  },
];

/** Balances tab content (from the hi-fi "Balances – Overview" / "All Settled" screens). */
export type Balance = {
  name: string;
  you?: boolean;
  avatar?: string; // Ren renders as the peach letter avatar
  amount: string;
  settledAmount?: string; // shown after settling up
  positive: boolean;
};

export const balances: Balance[] = [
  { name: "Ari", you: true, avatar: memberAri, amount: "− € 59,33", settledAmount: "+ € 0,00", positive: false },
  { name: "Tom", avatar: memberTom, amount: "+ € 717,17", positive: true },
  { name: "Lena", avatar: memberLena, amount: "− € 128,53", positive: false },
  { name: "Nic", avatar: avatar5, amount: "− € 163,63", positive: false },
  { name: "Mia", avatar: memberMia, amount: "− € 182,83", positive: false },
  { name: "Ren", amount: "− € 182,85", positive: false },
];
