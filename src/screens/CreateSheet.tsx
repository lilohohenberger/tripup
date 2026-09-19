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
  onStartPoll: (
    question: string,
    description: string,
    options: PollOption[],
    allowMultiple: boolean,
    allowAddOptions: boolean,
  ) => void;
  onSavePlan: (title: string, location: string) => void;
};

type SearchTarget = null | { kind: "plan" } | { kind: "option"; id: string };

let optionSeq = 0;
let draftSeq = 10;

type Draft = { id: number; value: string };

export default function CreateSheet({ mode, onModeChange, onClose, onStartPoll, onSavePlan }: Props) {
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  /** "Add another option" while a place is set — submitting converts to a poll. */
  const [placeDraft, setPlaceDraft] = useState("");
  const [options, setOptions] = useState<PollOption[]>([]);
  // Two empty option inputs on first open (Figma empty state).
  const [drafts, setDrafts] = useState<Draft[]>([
    { id: 1, value: "" },
    { id: 2, value: "" },
  ]);
  const [description, setDescription] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [allowAddOptions, setAllowAddOptions] = useState(true);
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
      // never more empty inputs than needed: two while the poll is empty,
      // exactly one once options exist (e.g. after a place converts to a poll)
      const wantEmpty = options.length === 0 ? 2 : 1;
      let empties = out.filter((d) => !d.value.trim()).length;
      if (empties > wantEmpty) {
        out = [...out];
        for (let i = out.length - 1; i >= 0 && empties > wantEmpty; i--) {
          if (!out[i].value.trim()) {
            out.splice(i, 1);
            empties--;
          }
        }
      }
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

  function pickPlace(picked: Place) {
    if (searchFor?.kind === "plan") {
      setPlace(picked);
    } else if (searchFor?.kind === "option") {
      const id = searchFor.id;
      setOptions((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, place: picked.name, image: o.image ?? picked.image } : o,
        ),
      );
    }
    setSearchFor(null);
  }

  /**
   * "Set a place" grows into a poll: submitting "Add another option" flips the
   * tab to "Start a poll" — the picked place becomes option #1 (shown by its
   * establishment name, with "@ name" underneath) and the typed text option #2.
   */
  function convertToPoll() {
    const extra = placeDraft.trim();
    if (!extra || !place) return;
    setOptions((prev) => [
      ...prev,
      {
        id: `opt-${optionSeq++}`,
        label: place.name,
        place: place.name,
        image: place.image,
        voters: [],
      },
      {
        id: `opt-${optionSeq++}`,
        label: extra,
        place: placeForOption(extra),
        image: imageForOption(extra),
        voters: [],
      },
    ]);
    setPlace(null);
    setPlaceDraft("");
    onModeChange("poll");
  }

  function submit() {
    if (!canSubmit) return;
    if (poll) onStartPoll(title.trim(), description.trim(), options, allowMultiple, allowAddOptions);
    // itinerary subline: restaurant name, then its address
    else onSavePlan(title.trim(), place ? `${place.name}, ${place.address}` : "");
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
        {/* Header bar (24px inset, 48px white icon button) — back only */}
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
                        : "Add another option...",
                    ),
                  )}
                </div>
              </div>
            ) : place ? (
              /* Picked location (Figma "Create Plan – Set Location"): name +
                 address; adding another option converts the plan into a poll */
              <div className="flex flex-col gap-0.5 w-full">
                <div className="bg-surface rounded-pill h-[74px] p-2 flex items-center gap-2 w-full">
                  <img
                    src={place.image ?? thumbGradient}
                    alt=""
                    className="size-[58px] rounded-full object-cover shrink-0"
                  />
                  <span className="flex-1 min-w-0 flex flex-col gap-1 items-start">
                    <span className="text-[16px] font-medium leading-normal text-ink truncate w-full">
                      {place.name}
                    </span>
                    <span className="text-[16px] leading-normal text-muted truncate w-full">
                      <SFSymbol name="location" /> {place.address}
                    </span>
                  </span>
                  <button
                    onClick={() => setPlace(null)}
                    aria-label={`Remove ${place.name}`}
                    className="size-10 rounded-[20px] bg-ink text-white flex items-center justify-center text-[16px] font-medium cursor-pointer shrink-0 active:bg-surface active:text-ink transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <PillInput
                  value={placeDraft}
                  onChange={setPlaceDraft}
                  onSubmit={convertToPoll}
                  placeholder="Add another option..."
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchFor({ kind: "plan" })}
                className="border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center gap-2 w-full cursor-pointer text-left"
              >
                <SFSymbol name="location" className="text-[24px] leading-normal text-muted" />
                <span className="flex-1 min-w-0 truncate text-[24px] leading-normal text-muted">
                  Search for a location
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
                <span className="text-[16px] leading-normal text-white">
                  Allow others to add options?
                </span>
                <Toggle
                  on={allowAddOptions}
                  onChange={setAllowAddOptions}
                  label="Allow others to add options"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-[16px] leading-normal text-white">Deadline</span>
                <button
                  onClick={showUndesignedToast}
                  className="border border-white text-white rounded-pill h-10 px-4 py-2 flex items-center gap-2 text-[16px] font-medium leading-normal cursor-pointer"
                >
                  1 hour before <SFSymbol name="chevronUpDown" className="font-light" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA: peach, 64px, radius 100, 1px black border; muted while incomplete.
          Only the button itself catches touches — the gradient scrolls the content */}
      <div className="absolute bottom-0 inset-x-0 px-2 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-b from-[rgba(19,19,19,0)] to-ink pointer-events-none">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className={`w-full h-16 rounded-pill border border-black px-4 py-2 text-[16px] font-medium leading-normal transition-colors pointer-events-auto ${
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
