"use client";

import * as React from "react";

const LAST_VISIT_KEY = "atlas_last_visit_at";

/**
 * Tracks the timestamp of the user's previous dashboard visit.
 * Returns the *previous* visit timestamp (not the current one) so the
 * "Since your last visit" summary can query events/scores changed
 * since that point — then immediately updates storage to now.
 */
export function useLastVisit() {
  const [previousVisit, setPreviousVisit] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(LAST_VISIT_KEY);
    setPreviousVisit(stored);
    localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
    setReady(true);
  }, []);

  return { previousVisit, ready };
}
