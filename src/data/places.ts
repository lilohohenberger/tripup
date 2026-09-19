import placeBelcanto from "../assets/place-belcanto.png";
import placeRamiro from "../assets/place-ramiro.png";
import placeTimeout from "../assets/place-timeout.png";

export type Place = {
  id: string;
  name: string;
  address: string;
  image?: string;
};

/** Location search content (from the hi-fi "Create Poll" search screen). */
export const suggestions: Place[] = [
  {
    id: "belcanto",
    name: "Belcanto",
    address: "R. Serpa Pinto 10A, 1200-026 Lisboa, Portugal",
    image: placeBelcanto,
  },
  {
    id: "ramiro",
    name: "Cervejaria Ramiro",
    address: "Av. Almirante Reis 1H, 1150-007 Lisboa, Portugal",
    image: placeRamiro,
  },
  {
    id: "timeout",
    name: "Time Out Market Lisboa",
    address: "Av. 24 de Julho 49, 1200-479 Lisboa, Portugal",
    image: placeTimeout,
  },
];

export const lastSearched: Place[] = [
  {
    id: "sto",
    name: "Stō Restaurante",
    address: "R. dos Fanqueiros 83 85, 1100-227 Lisboa, Portugal",
  },
  {
    id: "tueeu",
    name: "Lisboa Tu & Eu 2",
    address: "Escadinhas das Portas do Mar 4, 1100-410 Lisboa, Portugal",
  },
  {
    id: "solar",
    name: "Solar de Lisboa - Cozinha Tradicional Portuguesa",
    address: "Escadinhas das Portas do Mar 4, 1100-410 Lisboa, Portugal",
  },
];

/** Demo restaurants that only exist as poll-option places (not searchable). */
const pollPlaces: Place[] = [
  {
    id: "pizzeria-ramiro",
    name: "Pizzeria Ramiro",
    address: "Av. Almirante Reis 1H, 1150-007 Lisboa, Portugal",
  },
  {
    id: "alma",
    name: "Alma",
    address: "R. Anchieta 15, 1200-023 Lisboa, Portugal",
  },
];

/** Address lookup for itinerary sublines ("Name, Address"). */
export function addressForPlace(name: string): string | undefined {
  return [...suggestions, ...lastSearched, ...pollPlaces].find((p) => p.name === name)?.address;
}
