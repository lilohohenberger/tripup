import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TripsHome from "./screens/TripsHome";
import { SplashLogo, SplashHint, isIosBrowserTab } from "./screens/Splash";
import TripHome from "./screens/TripHome";
import AddMemberSheet from "./screens/AddMemberSheet";
import CreateSheet from "./screens/CreateSheet";
import VoteSheet from "./screens/VoteSheet";
import CameraView from "./screens/CameraView";
import LogExpense from "./screens/LogExpense";
import ExpensesTab from "./screens/ExpensesTab";
import ToastHost, { showMemberAddedToast } from "./components/Toast";
import {
  closeAppNotifications,
  ensureNotificationPermission,
  notify,
  onNotificationAction,
} from "./lib/notifications";
import avatarMe from "./assets/avatar-1.png";
import type { ItineraryEntry } from "./data/trip";
import { simulatedVotes, type Poll, type PollOption, type Sheet } from "./state";

export default function App() {
  const [view, setView] = useState<"trips" | "home" | "expenses">("trips");
  /** Splash on launch; iOS browser tabs get the install-hint afterwards. */
  const [splash, setSplash] = useState<"logo" | "hint" | null>("logo");
  // the immersive intro only plays when entering the trip from the trips overview
  const enteredFromTrips = useRef(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [createMode, setCreateMode] = useState<"place" | "poll">("poll");
  /** Name typed into "Add by name" — letter avatar + added-to-group banner. */
  const [addedMember, setAddedMember] = useState<string | null>(null);
  /** Where the expense screen was opened from (back returns there). */
  const expenseFrom = useRef<"camera" | "list">("camera");
  const [poll, setPoll] = useState<Poll | null>(null);
  const [winnerDismissed, setWinnerDismissed] = useState(false);
  const [plan, setPlan] = useState<ItineraryEntry | null>(null);
  const voteTimers = useRef<number[]>([]);

  useEffect(() => {
    const t = window.setTimeout(
      () => setSplash(isIosBrowserTab() ? "hint" : null),
      1600,
    );
    return () => window.clearTimeout(t);
  }, []);

  // Tapping the "New poll" (or winner) notification jumps straight to the poll.
  useEffect(
    () =>
      onNotificationAction((action) => {
        if (action === "open-poll") {
          setView("home");
          setSheet("vote");
        }
      }),
    [],
  );

  function openCreate(mode: "place" | "poll") {
    setCreateMode(mode);
    setSheet("create");
  }

  function startPoll(
    question: string,
    description: string,
    options: PollOption[],
    allowMultiple: boolean,
    allowAddOptions: boolean,
  ) {
    setPoll({
      question,
      description: description || undefined,
      options,
      allowMultiple,
      allowAddOptions,
      deadlineLabel: "1 hour before",
      minutesRemaining: 42,
      myVotes: [],
      totalMembers: addedMember ? 7 : 6,
    });
    setWinnerDismissed(false);
    setSheet(null);
    // notifications (the two Figma banners): ask for permission from this
    // user gesture, then announce the poll now and the winner once votes land
    ensureNotificationPermission().then((granted) => {
      if (!granted) return;
      notify(`New poll “${question}”! 🎉`, "Vote now, voting closes in 42 mins", "open-poll");
      window.setTimeout(() => {
        notify("Your poll has a winner 🎉", "Quick, check the results!", "open-poll");
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
    // the poll is decided — retire the "New poll" notification
    closeAppNotifications();
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
          memberLetter={addedMember ? addedMember[0].toUpperCase() : undefined}
          onAddMember={() => setSheet("addMember")}
          onOpenCreate={openCreate}
          onOpenVote={() => setSheet("vote")}
          onOpenExpenses={() => setView("expenses")}
          onBack={() => setView("trips")}
          winnerDismissed={winnerDismissed}
          onDismissWinner={() => setWinnerDismissed(true)}
        />
      ) : (
        <ExpensesTab
          onHome={() => {
            enteredFromTrips.current = false;
            setView("home");
          }}
          onLogExpense={() => setSheet("camera")}
          onOpenExpense={() => {
            expenseFrom.current = "list";
            setSheet("expense");
          }}
        />
      )}
      <AddMemberSheet
        open={sheet === "addMember"}
        onClose={() => setSheet(null)}
        onAddByName={(name) => {
          setAddedMember(name);
          showMemberAddedToast(name);
        }}
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
          <CameraView
            onClose={() => setSheet(null)}
            onCapture={() => {
              expenseFrom.current = "camera";
              setSheet("expense");
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sheet === "expense" && (
          <LogExpense
            onClose={() => setSheet(expenseFrom.current === "camera" ? "camera" : null)}
            onSave={() => setSheet(null)}
          />
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
      <AnimatePresence>
        {splash === "logo" ? (
          <SplashLogo key="splash-logo" />
        ) : splash === "hint" ? (
          <SplashHint key="splash-hint" onContinue={() => setSplash(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
