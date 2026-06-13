// Lightweight data-layer push. Safe to call anywhere on the client — it
// no-ops on the server and before GTM has created window.dataLayer.
// Set up GTM triggers/tags against these `event` names later.
export function track(
  event: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: Array<Record<string, unknown>>;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
