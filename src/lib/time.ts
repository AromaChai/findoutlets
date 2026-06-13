export function parseTime(
  timeStr: string
): {
  openHour: number;
  openMin: number;
  closeHour: number;
  closeMin: number;
} | null {
  const match = timeStr.match(
    /(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i
  );
  if (!match) return null;

  const [, oh, om, oap, ch, cm, cap] = match;

  const to24 = (h: number, ap: string) => {
    if (ap === "PM" && h !== 12) return h + 12;
    if (ap === "AM" && h === 12) return 0;
    return h;
  };

  return {
    openHour: to24(Number(oh), oap.toUpperCase()),
    openMin: Number(om),
    closeHour: to24(Number(ch), cap.toUpperCase()),
    closeMin: Number(cm),
  };
}

export function isOpen(outletTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parsed = parseTime(outletTime);
  if (!parsed) return false;

  const openMinutes = parsed.openHour * 60 + parsed.openMin;
  let closeMinutes = parsed.closeHour * 60 + parsed.closeMin;

  // overnight support
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Open/closed plus a friendly label. When closed, tells the visitor when it
 * next opens — e.g. "Opens at 8:30 AM" (later today) or
 * "Opens tomorrow at 8:30 AM".
 */
export function getOpenInfo(outletTime: string): {
  open: boolean;
  label: string;
} {
  const parsed = parseTime(outletTime);
  if (!parsed) return { open: false, label: "Closed" };

  if (isOpen(outletTime)) return { open: true, label: "Open now" };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parsed.openHour * 60 + parsed.openMin;
  const openStr = outletTime.split("-")[0].trim();

  // before today's opening time → opens later today; otherwise → tomorrow
  return currentMinutes < openMinutes
    ? { open: false, label: `Opens at ${openStr}` }
    : { open: false, label: `Opens tomorrow at ${openStr}` };
}
