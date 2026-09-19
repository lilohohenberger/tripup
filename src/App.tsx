import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TripsHome from "./screens/TripsHome";
import TripHome from "./screens/TripHome";
import AddMemberSheet from "./screens/AddMemberSheet";
import FabMenu from "./screens/FabMenu";
import CreateSheet from "./screens/CreateSheet";
import VoteSheet from "./screens/VoteSheet";
import CameraView from "./screens/CameraView";
import LogExpense from "./screens/LogExpense";
import ExpensesTab from "./screens/ExpensesTab";
import ToastHost from "./components/Toast";
import { ensureNotificationPermission, notify } from "./lib/notifications";
import avatarMe from "./assets/avatar-1.png";
import type { ItineraryEntry } from "./data/trip";
import { simulatedVotes, type Poll, type PollOption, type Sheet } from "./state";

export default function App() {
  const [view, setView] = useState<"trips" | "home" | "expenses">("trips");
  // the immersive intro only plays when entering the trip from the trips overview
  const enteredFromTrips = useRef(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [createMode, setCreateMode] = useState<"place" | "poll">("poll");
  const [renJoined, setRenJoined] = useState(false);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [plan, setPlan] = useState<ItineraryEntry | null>(null);
  const voteTimers = useRef<number[]>([]);

  function openCreate(mode: "place" | "poll") {
    setCreateMode(mode);
    setSheet("create");
  }

  function startPoll(question: string, options: PollOption[], allowMultiple: boolean) {
    setPoll({
      question,
      options,
      allowMultiple,
      deadlineLabel: "1 hour before",
      minutesRemaining: 42,
      myVotes: [],
      totalMembers: renJoined ? 7 : 6,
    });
    setSheet(null);
    // notifications (the two Figma banners): ask for permission from this
    // user gesture, then announce the poll now and the winner once votes land
    ensureNotificationPermission().then((granted) => {
      if (!granted) return;
      notify(`New poll “${question}”! 🎉`, "Vote now, voting closes in 42 mins");
      window.setTimeout(() => {
        notify("Your poll has a winner 🎉", "Quick, check the results!");
      }, 18000);
    });
    // friends vote in over time → the vote sheet reorders live
    voteTimers.current.forEach(clearTimeout);
    voteTimers.current = simulatedVotes.map(({ delayMs, avatar, optionIndex }) =>
      window.setTimeout(() => {
        setPoll((p) => {
          if (!p) return p;
          const options = p.options.map((o, i) =>
            i === Math.min(optionIndex, p.options.length - 1)
              ? { ...o, voters: [...o.voters, avatar] }
              : o,
          );
          return { ...p, options };
        });
      }, delayMs),
    );
  }

  function saveVote(optionIds: string[]) {
    setPoll((p) => {
      if (!p) return p;
      const options = p.options.map((o) =>
        optionIds.includes(o.id) ? { ...o, voters: [...o.voters, avatarMe] } : o,
      );
      return { ...p, options, myVotes: optionIds, decided: true };
    });
    setSheet(null);
  }

  function addPollOption(option: PollOption) {
    setPoll((p) => (p ? { ...p, options: [...p.options, option] } : p));
  }

  function savePlan(title: string, location: string) {
    setPlan({
      id: "evening-plan",
      title,
      address: location || "Lisboa, Portugal",
      start: "20:00",
      end: "22:00",
      state: "next",
    });
    setSheet(null);
  }

  return (
    <div className="stage">
      {view === "trips" ? (
        <TripsHome
          onOpenTrip={() => {
            enteredFromTrips.current = true;
            setView("home");
          }}
        />
      ) : view === "home" ? (
        <TripHome
          animateIntro={enteredFromTrips.current}
          poll={poll}
          plan={plan}
          renJoined={renJoined}
          onAddMember={() => setSheet("addMember")}
          onOpenFab={() => setSheet("fab")}
          onOpenCreate={openCreate}
          onOpenVote={() => setSheet("vote")}
          onOpenExpenses={() => setView("expenses")}
          onBack={() => setView("trips")}
        />
      ) : (
        <ExpensesTab
          onHome={() => {
            enteredFromTrips.current = false;
            setView("home");
          }}
          onLogExpense={() => setSheet("camera")}
          onOpenFab={() => setSheet("fab")}
        />
      )}
      <AddMemberSheet
        open={sheet === "addMember"}
        onClose={() => setSheet(null)}
        onAddByName={() => setRenJoined(true)}
      />
      <FabMenu
        open={sheet === "fab"}
        activeTab={view === "expenses" ? "expenses" : "home"}
        onClose={() => setSheet(null)}
        onAskGroup={() => openCreate("poll")}
        onAddToItinerary={() => openCreate("place")}
        onAddExpense={() => setSheet("camera")}
      />
      <AnimatePresence>
        {sheet === "create" && (
          <CreateSheet
            mode={createMode}
            onModeChange={setCreateMode}
            onClose={() => setSheet(null)}
            onStartPoll={startPoll}
            onSavePlan={savePlan}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sheet === "camera" && (
          <CameraView onClose={() => setSheet(null)} onCapture={() => setSheet("expense")} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sheet === "expense" && (
          <LogExpense onClose={() => setSheet("camera")} onSave={() => setSheet(null)} />
        )}
      </AnimatePresence>
      <VoteSheet
        open={sheet === "vote"}
        poll={poll}
        onClose={() => setSheet(null)}
        onSaveVote={saveVote}
        onAddOption={addPollOption}
      />
      <ToastHost />
    </div>
  );
}
