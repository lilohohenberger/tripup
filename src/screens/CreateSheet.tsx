import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import PillInput from "../components/PillInput";
import Toggle from "../components/Toggle";
import LocationSearch from "./LocationSearch";
import { showUndesignedToast } from "../components/Toast";
import { enterTransition, exitTransition } from "../lib/motion";
import thumbGradient from "../assets/thumb-gradient.svg";
import { imageForOption, placeForOption, type PollOption } from "../state";
import type { Place } from "../data/places";

type Props = {
  mode: "place" | "poll";
  onModeChange: (m: "place" | "poll") => void;
  onClose: () => void;
  onStartPoll: (question: string, options: PollOption[], allowMultiple: boolean) => void;
  onSavePlan: (title: string, location: string) => void;
};

type SearchTarget = null | { kind: "plan" } | { kind: "option"; id: string };

let optionSeq = 0;
let draftSeq = 10;

type Draft = { id: number; value: string };

export default function CreateSheet({ mode, onModeChange, onClose, onStartPoll, onSavePlan }: Props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [options, setOptions] = useState<PollOption[]>([]);
  // Two empty option inputs on first open (Figma empty state).
  const [drafts, setDrafts] = useState<Draft[]>([
    { id: 1, value: "" },
    { id: 2, value: "" },
  ]);
  const [description, setDescription] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [searchFor, setSearchFor] = useState<SearchTarget>(null);
  const committedDrafts = useRef<Set<number>>(new Set());
  const titleRef = useRef<HTMLInputElement>(null);

  const poll = mode === "poll";
  const canSubmit = poll ? title.trim() !== "" && options.length >= 2 : title.trim() !== "";

  function addOption(label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    setOptions((o) => [
      ...o,
      {
        id: `opt-${optionSeq++}`,
        label: trimmed,
        place: placeForOption(trimmed),
        image: imageForOption(trimmed),
        voters: [],
      },
    ]);
  }

  /**
   * Invariants for the option inputs: pills + inputs never drop below two
   * slots, and there is always at least one EMPTY input to type the next
   * option into. Self-healing after every options/drafts change.
   */
  useEffect(() => {
    setDrafts((prev) => {
      let out = prev;
      while (options.length + out.length < 2) out = [...out, { id: draftSeq++, value: "" }];
      if (!out.some((d) => !d.value.trim())) out = [...out, { id: draftSeq++, value: "" }];
      return out;
    });
  }, [options, drafts]);

  /** Turn a draft input into a poll option (on Enter or when focus moves on). */
  function commitDraft(id: number, value: string) {
    if (!value.trim() || committedDrafts.current.has(id)) return;
    committedDrafts.current.add(id);
    addOption(value);
    setDrafts((prev) => prev.filter((p) => p.id !== id));
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((p) => p.id !== id));
  }

  function pickPlace(place: Place) {
    if (searchFor?.kind === "plan") {
      setLocation(place.name);
    } else if (searchFor?.kind === "option") {
      const id = searchFor.id;
      setOptions((prev) =>
        prev.map((o) => (o.id === id ? { ...o, place: place.name, image: o.image ?? place.image } : o)),
      );
    }
    setSearchFor(null);
  }

  function submit() {
    if (!canSubmit) return;
    if (poll) onStartPoll(title.trim(), options, allowMultiple);
    else onSavePlan(title.trim(), location.trim());
  }

  function optionInput(d: Draft, placeholder: string) {
    return (
      <PillInput
        key={d.id}
        value={d.value}
        onChange={(v) =>
          setDrafts((prev) => prev.map((p) => (p.id === d.id ? { ...p, value: v } : p)))
        }
        onSubmit={() => commitDraft(d.id, d.value)}
        commitOnBlur
        placeholder={placeholder}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-ink flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: 0, transition: enterTransition }}
      exit={{ y: "100%", transition: exitTransition }}
      onAnimationComplete={(def) => {
        // focus only after the sheet has landed — an early autofocus makes the
        // browser scroll the sheet into place and kills the slide-in
        if (typeof def === "object" && def !== null && "y" in def && def.y === 0) {
          titleRef.current?.focus({ preventScroll: true });
        }
      }}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Header bar (24px inset, 48px white icon button) */}
        <div className="flex items-center px-6 py-4 pt-[max(16px,env(safe-area-inset-top))]">
          <IconButton symbol="chevronBackward" label="Back" onClick={onClose} />
        </div>

        {/* Content: 8px gutter, 16px between sections */}
        <div className="flex flex-col gap-4 px-2 pb-28">
          {/* Poll header group: 4px stack */}
          <div className="flex flex-col gap-1 w-full">
            {/* Title card: white, radius 40, padding 24; title 32 Medium, description 24 Regular */}
            <div className="bg-surface rounded-card p-6 flex flex-col gap-1">
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title"
                className="bg-transparent outline-none text-[32px] font-medium leading-normal text-ink placeholder:text-muted w-full"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="≡ Add description"
                className="bg-transparent outline-none text-[24px] leading-normal text-ink placeholder:text-muted w-full"
              />
            </div>

            {/* Date row: white, radius 40, 1px black border, 24×16 padding, 24 Medium */}
            <button
              onClick={showUndesignedToast}
              className="bg-surface border border-black rounded-card px-6 py-4 flex items-center justify-between text-ink cursor-pointer"
            >
              <span className="text-[24px] font-medium leading-normal">Sat, Jun 26</span>
              <span className="text-[24px] font-medium leading-normal">20:00 — 22:00</span>
            </button>

            {/* Segmented control: ink pill with white border; the active white
                pill slides over to the tapped segment */}
            <div className="bg-ink border border-white rounded-pill flex">
              {(["place", "poll"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className="relative flex-1 rounded-pill p-4 text-[16px] leading-normal cursor-pointer"
                >
                  {mode === m && (
                    <motion.span
                      layoutId="segment-active"
                      className="absolute inset-0 bg-surface rounded-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative transition-colors duration-300 ${
                      mode === m ? "text-ink font-medium" : "text-white"
                    }`}
                  >
                    {m === "place" ? "Set a place" : "Start a poll"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Options / Where section */}
          <div className="flex flex-col gap-0.5 w-full">
            <div className="h-[29px] flex items-center w-full">
              <p className="text-[16px] leading-normal text-white">{poll ? "Options" : "Where?"}</p>
            </div>

            {poll ? (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <AnimatePresence initial={false}>
                  {options.map((o) => (
                    <motion.div
                      key={o.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-full overflow-hidden shrink-0"
                    >
                    <div className="bg-surface rounded-pill p-2 flex items-center gap-2">
                      <img
                        src={o.image ?? thumbGradient}
                        alt=""
                        className="size-[58px] rounded-full object-cover shrink-0"
                      />
                      <span className="flex-1 min-w-0 flex flex-col gap-1 items-start">
                        <span className="text-[16px] font-medium leading-normal text-ink truncate w-full">
                          {o.label}
                        </span>
                        {o.place ? (
                          <button
                            onClick={() =>
                              setOptions((prev) =>
                                prev.map((p) =>
                                  p.id === o.id
                                    ? { ...p, place: undefined, image: imageForOption(p.label) }
                                    : p,
                                ),
                              )
                            }
                            aria-label={`Remove location ${o.place}`}
                            className="border border-black text-ink text-[12px] leading-normal rounded-pill px-2 py-1 cursor-pointer"
                          >
                            @ {o.place} ✕
                          </button>
                        ) : (
                          <button
                            onClick={() => setSearchFor({ kind: "option", id: o.id })}
                            className="text-ink text-[12px] leading-normal py-1 cursor-pointer"
                          >
                            <SFSymbol name="plusCircle" /> Add location
                          </button>
                        )}
                      </span>
                      <button
                        onClick={() => removeOption(o.id)}
                        aria-label={`Remove ${o.label}`}
                        className="size-10 rounded-[20px] bg-ink text-white flex items-center justify-center text-[16px] font-medium cursor-pointer shrink-0 active:bg-surface active:text-ink transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                  {/* Empty inputs sit in the same 4px stack as the option pills */}
                  {drafts.map((d, i) =>
                    optionInput(
                      d,
                      options.length + i < 2
                        ? `Option ${options.length + i + 1}`
                        : "Add another option ...",
                    ),
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSearchFor({ kind: "plan" })}
                className="border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center gap-2 w-full cursor-pointer text-left"
              >
                <SFSymbol
                  name="location"
                  className={`text-[24px] leading-normal ${location ? "hidden" : "text-muted"}`}
                />
                <span
                  className={`flex-1 min-w-0 truncate text-[24px] leading-normal ${
                    location ? "text-white" : "text-muted"
                  }`}
                >
                  {location || "Search for a location"}
                </span>
              </button>
            )}
          </div>

          {/* Poll settings */}
          {poll && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between w-full">
                <span className="text-[16px] leading-normal text-white">Allow multiple votes?</span>
                <Toggle on={allowMultiple} onChange={setAllowMultiple} label="Allow multiple votes" />
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-[16px] leading-normal text-white">Deadline</span>
                <button
                  onClick={showUndesignedToast}
                  className="bg-surface text-ink rounded-pill h-10 px-4 py-2 flex items-center gap-1 text-[16px] font-medium leading-normal cursor-pointer"
                >
                  1 hour before <SFSymbol name="chevronUpDown" className="font-light" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA: peach, 64px, radius 100, 1px black border; muted while incomplete */}
      <div className="absolute bottom-0 inset-x-0 px-2 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-b from-[rgba(19,19,19,0)] to-ink">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className={`w-full h-16 rounded-pill border border-black px-4 py-2 text-[16px] font-medium leading-normal transition-colors ${
            canSubmit
              ? "bg-peach text-ink cursor-pointer active:brightness-95"
              : "bg-muted text-[#2c2c2c] cursor-default"
          }`}
        >
          {poll ? "Start poll" : "Save plan"}
        </button>
      </div>

      <AnimatePresence>
        {searchFor && <LocationSearch onClose={() => setSearchFor(null)} onPick={pickPlace} />}
      </AnimatePresence>
    </motion.div>
  );
}
