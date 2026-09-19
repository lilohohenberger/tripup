/**
 * Open/close timing for all overlays.
 * Enter: 500ms with the iOS sheet curve (fast start, long soft landing).
 * Exit: 400ms easing in (soft start, accelerating toward the bottom).
 */
export const enterTransition = { duration: 0.5, ease: [0.32, 0.72, 0, 1] } as const;
export const exitTransition = { duration: 0.4, ease: "easeIn" } as const;
