/**
 * Opens the native share sheet for the trip invite link (Web Share API).
 * On iOS Safari — and in the installed PWA — this is the real system sheet.
 * Falls back to copying the link when share is unavailable (e.g. desktop Firefox).
 */
export async function shareInviteLink(tripName: string, url: string): Promise<"shared" | "copied" | "dismissed"> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: tripName,
        text: `Join our trip “${tripName}” on TripUp!`,
        url,
      });
      return "shared";
    } catch {
      // user closed the sheet
      return "dismissed";
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied";
}
