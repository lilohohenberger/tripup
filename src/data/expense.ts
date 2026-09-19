import memberAri from "../assets/member-ari.png";
import memberLena from "../assets/member-lena.png";
import memberTom from "../assets/member-tom.png";
import memberMia from "../assets/member-mia.png";
import avatar5 from "../assets/avatar-5.png";

export type ExpenseMember = {
  id: string;
  name: string;
  /** Photo avatar; Ren renders as the peach letter avatar instead. */
  avatar?: string;
};

export const expenseMembers: ExpenseMember[] = [
  { id: "ari", name: "Ari", avatar: memberAri },
  { id: "lena", name: "Lena", avatar: memberLena },
  { id: "tom", name: "Tom", avatar: memberTom },
  { id: "mia", name: "Mia", avatar: memberMia },
  { id: "ren", name: "Ren" },
  { id: "nic", name: "Nic", avatar: avatar5 },
];

export type ExpenseItem = {
  id: string;
  name: string;
  price: string;
  /** Member ids excluded from sharing this item. */
  excluded: string[];
};

/** Scanned receipt content (from the hi-fi "Log expense" screen). */
export const initialExpenseItems: ExpenseItem[] = [
  { id: "margherita", name: "Pizza Margherita", price: "12,50", excluded: [] },
  { id: "calzone", name: "Calzone", price: "19,00", excluded: [] },
  { id: "diavola", name: "Pizza Diavola x2", price: "19,00", excluded: [] },
  { id: "vinho", name: "Vinho Tinto (bottle)", price: "22,00", excluded: [] },
];
