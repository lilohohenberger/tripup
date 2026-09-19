import { motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import AvatarStack from "../components/AvatarStack";
import { showUndesignedToast } from "../components/Toast";
import { trip } from "../data/trip";
import ideaGourmet from "../assets/idea-gourmet.png";
import ideaBeach from "../assets/idea-beach.png";

type Props = {
  onOpenTrip: () => void;
};

/** Shared timing for the card → detail-hero morph: slow and soft, like settling in. */
export const tripMorph = { duration: 0.7, ease: [0.32, 0.72, 0, 1] } as const;

const pastTrips = [
  { name: "Barcelona ’25", dates: "Sep 4 – 8 2025", image: ideaGourmet },
  { name: "Beach Week Crete", dates: "Jul 1 – 9 2025", image: ideaBeach },
];

/**
 * App entry screen (Figma "Trips Home – V4 Featured"): all of Ari's trips.
 * The featured card morphs into the trip detail hero when opened.
 */
export default function TripsHome({ onOpenTrip }: Props) {
  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto overscroll-contain">
        {/* Content: 8px gutter, 16px stack gap */}
        <div className="flex flex-col gap-4 px-2 pt-[calc(16px+env(safe-area-inset-top))] pb-10">
          {/* Header: title 40 Medium + plus & bell buttons */}
          <div className="flex items-center justify-between py-2 w-full">
            <p className="text-[40px] font-medium leading-normal text-white">Your trips</p>
            <div className="flex items-center gap-2">
              <IconButton symbol="plus" label="New trip" glyphSize={16} onClick={showUndesignedToast} />
              <IconButton symbol="bell" label="Notifications" glyphSize={16} onClick={showUndesignedToast} />
            </div>
          </div>

          {/* Featured trip: cover + overlapping white info card (1px black border) */}
          <button onClick={onOpenTrip} className="flex flex-col w-full cursor-pointer text-left relative">
            <motion.div
              layoutId="trip-cover"
              transition={tripMorph}
              className="relative h-[300px] rounded-card overflow-hidden w-full mb-[-82px]"
            >
              <img src={trip.cover} alt="Lisbon" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 rounded-card shadow-media-inset pointer-events-none" />
            </motion.div>
            <motion.div
              layoutId="trip-info"
              transition={tripMorph}
              className="bg-surface border border-black rounded-card p-6 flex flex-col gap-2 relative w-full"
            >
              <AvatarStack images={trip.members} staticAdd />
              <div className="flex flex-col gap-0.5 text-ink">
                <p className="text-[40px] font-medium leading-normal">{trip.name}</p>
                <p className="text-[16px] leading-normal">
                  <SFSymbol name="calendar" className="font-light" /> {trip.dates}
                </p>
              </div>
            </motion.div>
            {/* Status tag on the cover (pad 4/8/4/4, gap 4) */}
            <span className="absolute left-[25px] top-[21px] bg-surface border border-ink rounded-pill pl-1 pr-2 py-1 flex items-center gap-1 text-[12px] leading-normal text-ink">
              <SFSymbol name="circleFill" className="font-light text-peach" /> ongoing trip
            </span>
          </button>

          {/* Past trips */}
          <div className="flex flex-col gap-0.5 w-full">
            <div className="h-[29px] flex items-center w-full">
              <p className="text-[16px] leading-normal text-white">Past trips</p>
            </div>
            <div className="flex flex-col gap-1 w-full">
              {pastTrips.map((t) => (
                <button
                  key={t.name}
                  onClick={showUndesignedToast}
                  className="bg-periwinkle rounded-card h-[74px] pl-2 pr-6 py-2 flex items-center gap-2 w-full cursor-pointer text-left"
                >
                  <span className="relative size-[58px] rounded-full overflow-hidden shrink-0">
                    <img src={t.image} alt="" className="absolute inset-0 size-full object-cover" />
                    <span className="absolute inset-0 rounded-full shadow-media-inset pointer-events-none" />
                  </span>
                  <span className="flex-1 min-w-0 flex flex-col">
                    <span className="text-[16px] font-medium leading-normal text-ink truncate">
                      {t.name}
                    </span>
                    <span className="text-[12px] leading-normal text-ink truncate">
                      <SFSymbol name="calendar" /> {t.dates}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
