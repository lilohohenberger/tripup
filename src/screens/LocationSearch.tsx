import { useRef, useState } from "react";
import { motion } from "framer-motion";
import SFSymbol from "../components/SFSymbol";
import IconButton from "../components/IconButton";
import { suggestions, lastSearched, type Place } from "../data/places";
import { enterTransition, exitTransition } from "../lib/motion";

type Props = {
  onClose: () => void;
  onPick: (place: Place) => void;
};

/**
 * Full-screen location search (Figma "Create Poll" search state):
 * search input with magnifier, "Suggestions from your ideas" with 55px
 * thumbnails, "Last searched" rows with clock glyphs.
 */
export default function LocationSearch({ onClose, onPick }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const matches = (p: Place) => q === "" || p.name.toLowerCase().includes(q);
  const suggested = suggestions.filter(matches);
  const recent = lastSearched.filter(matches);

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-ink flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: 0, transition: enterTransition }}
      exit={{ y: "100%", transition: exitTransition }}
      onAnimationComplete={(def) => {
        if (typeof def === "object" && def !== null && "y" in def && def.y === 0) {
          inputRef.current?.focus({ preventScroll: true });
        }
      }}
    >
      <div className="flex items-center px-6 py-4 pt-[max(16px,env(safe-area-inset-top))]">
        <IconButton symbol="chevronBackward" label="Back" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-2 pb-10">
          {/* Search input: 62px pill, 1px #949494 border, magnifier + 24 Regular */}
          <div className="group border border-muted rounded-pill h-[62px] px-4 py-2 flex items-center gap-2 w-full">
            <SFSymbol
              name="magnifyingglass"
              className={`text-[24px] text-muted leading-normal group-focus-within:hidden ${
                query ? "hidden" : ""
              }`}
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
              placeholder="Dinner near Alfama"
              className="bg-transparent outline-none text-[24px] leading-normal text-white placeholder:text-muted flex-1 min-w-0"
            />
          </div>

          {suggested.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              <div className="h-8 flex items-center w-full">
                <p className="text-[16px] leading-normal text-white">Suggestions from your ideas</p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {suggested.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPick(p)}
                    className="flex items-center gap-4 w-full text-left cursor-pointer active:opacity-80"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="size-[55px] rounded-full object-cover shrink-0"
                    />
                    <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-[16px] font-medium leading-normal text-white">
                        {p.name}
                      </span>
                      <span className="text-[16px] leading-normal text-muted truncate">
                        <SFSymbol name="location" /> {p.address}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recent.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              <div className="h-8 flex items-center w-full">
                <p className="text-[16px] leading-normal text-white">Last searched</p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {recent.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPick(p)}
                    className="flex items-start gap-4 py-2 w-full text-left cursor-pointer active:opacity-80"
                  >
                    <SFSymbol
                      name="clock"
                      className="text-[16px] font-medium leading-normal text-[#686868] shrink-0"
                    />
                    <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-[16px] font-medium leading-normal text-white">
                        {p.name}
                      </span>
                      <span className="text-[16px] leading-normal text-muted truncate">
                        <SFSymbol name="location" /> {p.address}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
