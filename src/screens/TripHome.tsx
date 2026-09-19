import { motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import MenuBar from "../components/MenuBar";
import { showUndesignedToast } from "../components/Toast";
import { tripMorph } from "./TripsHome";
import AvatarStack from "../components/AvatarStack";
import PillButton from "../components/PillButton";
import PromptCard from "../components/PromptCard";
import SectionHeader from "../components/SectionHeader";
import ItineraryItem from "../components/ItineraryItem";
import IdeaCard from "../components/IdeaCard";
import { trip, prompt, itinerary, ideas, type ItineraryEntry } from "../data/trip";
import { votedCount, type Poll } from "../state";

type Props = {
  poll: Poll | null;
  plan: ItineraryEntry | null;
  renJoined: boolean;
  onAddMember: () => void;
  onOpenFab: () => void;
  onOpenCreate: (mode: "place" | "poll") => void;
  onOpenVote: () => void;
  onOpenExpenses: () => void;
  onBack: () => void;
  /** Play the card-morph intro (only when arriving from the trips overview). */
  animateIntro?: boolean;
};

export default function TripHome({
  poll,
  plan,
  renJoined,
  onAddMember,
  onOpenFab,
  onOpenCreate,
  onOpenVote,
  onOpenExpenses,
  onBack,
  animateIntro = false,
}: Props) {
  const eveningSettled = poll !== null || plan !== null;

  /** Content below the hero streams in while the card morph is still landing. */
  const intro = (order: number) =>
    animateIntro
      ? {
          initial: { opacity: 0, y: 24 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.1 + order * 0.08, duration: 0.45, ease: "easeOut" as const },
          },
        }
      : { initial: false as const };
  const winner =
    poll?.decided && poll.options.length > 0
      ? poll.options.reduce((a, b) => (b.voters.length > a.voters.length ? b : a))
      : null;

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto overscroll-contain">
        {/* Content: 8px gutter, 4px stack gap (Figma "Content") */}
        <div className="flex flex-col gap-1 px-2 pt-[env(safe-area-inset-top)] pb-20">
          {/* Hero: cover photo, title card overlaps it by 82.5px; morphs in from the trips-home card */}
          <div className="flex flex-col w-full">
            <motion.div
              layoutId="trip-cover"
              transition={tripMorph}
              className="relative h-[350px] rounded-card overflow-hidden w-full mb-[-82.5px]"
            >
              <img
                src={trip.cover}
                alt="Lisbon"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 rounded-card shadow-media-inset pointer-events-none" />
            </motion.div>
            <motion.div
              layoutId="trip-info"
              transition={tripMorph}
              className="bg-surface border border-black rounded-card p-6 flex flex-col gap-2 relative w-full"
            >
              <AvatarStack
                images={trip.members}
                letter={renJoined ? "R" : undefined}
                onAdd={onAddMember}
              />
              <div className="flex flex-col gap-0.5 text-ink">
                <p className="text-[40px] font-medium leading-normal">{trip.name}</p>
                <p className="text-[16px] leading-normal">
                  <SFSymbol name="calendar" /> {trip.dates}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Attention slot: prompt → live poll banner (peach, pulsing 2px white stroke) */}
          {(winner || poll || !plan) && (
          <motion.div {...intro(0)} className="w-full">
          {winner ? (
            <button
              onClick={onOpenVote}
              className="bg-peach rounded-card p-6 flex flex-col gap-0.5 w-full overflow-hidden text-left cursor-pointer"
            >
              <p className="text-[16px] leading-normal text-ink">
                <SFSymbol name="chartBar" /> Your poll has a winner 🎉
              </p>
              <p className="text-[24px] font-medium leading-normal text-ink">{winner.label}</p>
            </button>
          ) : poll ? (
            <div className="pulse-stroke bg-peach rounded-card p-6 flex flex-col gap-4 w-full overflow-hidden">
              <div className="flex flex-col gap-0.5 w-full">
                <div className="flex gap-0.5 items-start w-full">
                  <p className="flex-1 min-w-0 text-[16px] leading-normal text-ink">
                    <SFSymbol name="chartBar" /> New group poll!
                  </p>
                  <span className="border border-black text-ink text-[12px] leading-normal rounded-pill px-2 py-1 shrink-0">
                    {votedCount(poll)}/{poll.totalMembers} have voted
                  </span>
                </div>
                <p className="text-[24px] font-medium leading-normal text-ink">{poll.question}</p>
              </div>
              <div className="flex items-center w-full">
                <button
                  onClick={onOpenVote}
                  className="bg-surface border border-black text-ink rounded-pill h-10 px-4 py-2 flex-1 flex items-center justify-center text-[16px] leading-normal cursor-pointer active:bg-ink active:text-white transition-colors"
                >
                  Cast your vote now!
                </button>
              </div>
            </div>
          ) : plan ? null : (
            <PromptCard
              eyebrow={prompt.eyebrow}
              headline={prompt.headline}
              actions={
                <>
                  <PillButton variant="secondary" onClick={() => onOpenCreate("poll")}>
                    Let the group decide!
                  </PillButton>
                  <PillButton variant="primary" onClick={() => onOpenCreate("place")}>
                    Add plan
                  </PillButton>
                </>
              }
            />
          )}
          </motion.div>
          )}

          {/* Itinerary: 16px between day groups */}
          <motion.section {...intro(1)} className="flex flex-col gap-2 w-full pt-2">
            <SectionHeader title="Your itinerary" onOpen={showUndesignedToast} />
            <div className="flex flex-col gap-4 w-full">
              {eveningSettled && (
                <div className="flex gap-2 items-start w-full">
                  <div className="flex flex-col text-white shrink-0 w-[37px]">
                    <p className="text-[16px] leading-normal">SAT</p>
                    <p className="text-[32px] font-medium leading-normal">26</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    {winner ? (
                      <ItineraryItem
                        entry={{
                          id: "winner",
                          title: winner.label,
                          address: winner.place ?? "Lisboa, Portugal",
                          start: "20:00",
                          end: "22:00",
                          state: "next",
                        }}
                      />
                    ) : poll ? (
                      <button
                        onClick={onOpenVote}
                        className="border border-white rounded-card w-full flex gap-2 items-start px-6 py-4 text-white cursor-pointer text-left"
                      >
                        <span className="flex-1 min-w-0 flex flex-col gap-1 items-start">
                          <span className="text-[16px] font-medium leading-normal truncate w-full">
                            {poll.question}
                          </span>
                          <span className="border border-white text-white text-[12px] leading-normal rounded-pill px-2 py-1">
                            <SFSymbol name="circleFill" className="font-light text-periwinkle" />{" "}
                            ongoing poll
                          </span>
                        </span>
                        <span className="flex flex-col gap-0.5 text-[16px] font-medium leading-normal shrink-0">
                          <span>20:00</span>
                          <span>22:00</span>
                        </span>
                      </button>
                    ) : (
                      plan && <ItineraryItem entry={plan} />
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2 items-start w-full">
                <div className="flex flex-col text-white shrink-0 w-[37px]">
                  <p className="text-[16px] leading-normal">{itinerary.day}</p>
                  <p className="text-[32px] font-medium leading-normal">{itinerary.date}</p>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {itinerary.entries.map((entry) => (
                    <ItineraryItem key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Group ideas */}
          <motion.section {...intro(2)} className="flex flex-col gap-2 w-full pt-2">
            <SectionHeader title="Your group’s ideas" onOpen={showUndesignedToast} />
            <div className="grid grid-cols-2 gap-1 items-start">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Header bar floating over the cover (Figma "Header bar": 24px inset) */}
      <motion.div
        initial={animateIntro ? { opacity: 0 } : false}
        animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.4, ease: "easeOut" } }}
        className="absolute top-[env(safe-area-inset-top)] inset-x-0 z-10 flex items-center justify-between px-6 py-4"
      >
        <IconButton symbol="chevronBackward" label="Back" onClick={onBack} />
        <IconButton symbol="pencil" label="Edit trip" onClick={showUndesignedToast} />
      </motion.div>

      <motion.div
        initial={animateIntro ? { opacity: 0 } : false}
        animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.4, ease: "easeOut" } }}
      >
        <MenuBar active="home" onExpenses={onOpenExpenses} action="plus" onAction={onOpenFab} />
      </motion.div>
    </div>
  );
}
