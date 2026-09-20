import { useRef } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

type Props = {
  /** Index of the segment this pill currently sits in. */
  index: number;
  count: number;
  onSelect: (index: number) => void;
  layoutId?: string;
  transition?: Transition;
};

/**
 * The white active pill inside segmented controls and the menu bar.
 * Slides over via layoutId — and can be dragged to a neighbouring segment
 * like a toggle knob (segments are equal-width in all our controls).
 */
export default function SlidePill({ index, count, onSelect, layoutId, transition }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <motion.span
      ref={ref}
      layoutId={layoutId}
      transition={transition}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      dragMomentum={false}
      dragSnapToOrigin
      onDragEnd={(_, info) => {
        const width = ref.current?.offsetWidth || 1;
        const target = Math.min(
          count - 1,
          Math.max(0, index + Math.round(info.offset.x / width)),
        );
        if (target !== index) onSelect(target);
      }}
      className="absolute inset-0 bg-surface rounded-pill"
    />
  );
}
