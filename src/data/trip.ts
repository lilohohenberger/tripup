import cover from "../assets/cover.png";
import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";
import avatar5 from "../assets/avatar-5.png";
import avatarS1 from "../assets/avatar-s1.png";
import avatarS2 from "../assets/avatar-s2.png";
import avatarS3 from "../assets/avatar-s3.png";
import avatarS4 from "../assets/avatar-s4.png";
import avatarS5 from "../assets/avatar-s5.png";
import ideaMuseum from "../assets/idea-museum.png";
import ideaExperience from "../assets/idea-experience.png";
import ideaGourmet from "../assets/idea-gourmet.png";
import ideaBeach from "../assets/idea-beach.png";

export const trip = {
  name: "Portu-Gaaals!",
  dates: "Jun 21 – 27",
  cover,
  members: [avatar1, avatar2, avatar3, avatar4, avatar5],
};

export const prompt = {
  eyebrow: "Night’s still young...",
  headline: "What will you do on your last evening? 👀",
};

export type ItineraryEntry = {
  id: string;
  title: string;
  address: string;
  start: string;
  end: string;
  state: "next" | "default";
};

export const itinerary: { day: string; date: string; entries: ItineraryEntry[] } = {
  day: "MO",
  date: "27",
  entries: [
    {
      id: "breakfast",
      title: "Breakfast of Champions",
      address: "Palacete Chafariz d'El Rei",
      start: "08:00",
      end: "09:00",
      state: "next",
    },
    {
      id: "monastery",
      title: "Jerónimos Monastery",
      address: "Praça do Império 1400-206 Lisboa, Portugal",
      start: "13:00",
      end: "15:30",
      state: "default",
    },
    {
      id: "flight",
      title: "Flight to LIS to VIE",
      address: "Humberto Delgado Airport, Lisboa, Portugal",
      start: "19:00",
      end: "21:30",
      state: "default",
    },
  ],
};

export type Idea = {
  id: string;
  image: string;
  tag: string;
  title: string;
  addedBy: string;
  voters: string[];
};

export const ideas: Idea[] = [
  {
    id: "museum",
    image: ideaMuseum,
    tag: "Museum",
    title: "Museum of Lisbon, Pimenta Palace",
    addedBy: "Added by Nic",
    voters: [avatarS1, avatarS2, avatarS3],
  },
  {
    id: "experience",
    image: ideaExperience,
    tag: "Experience",
    title: "Museum of Lisbon, Pimenta Palace",
    addedBy: "Added by you",
    voters: [avatarS4, avatarS3],
  },
  {
    id: "gourmet",
    image: ideaGourmet,
    tag: "Restaurant",
    title: "Gourmet Experience Lisboa",
    addedBy: "Added by Tom",
    voters: [avatarS5, avatarS1],
  },
  {
    id: "beach",
    image: ideaBeach,
    tag: "Vibes",
    title: "Let’s chill by the beach, gals",
    addedBy: "Added by you",
    voters: [avatarS3],
  },
];
