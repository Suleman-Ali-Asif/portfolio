"use client";

import { useEffect, useState } from "react";

/**
 * LocalTime — the current time in Lahore, ticking once a minute.
 * Renders a stable placeholder on the server to avoid hydration mismatch.
 */
export default function LocalTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, msToNextMinute);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <time
      dateTime={time ?? undefined}
      className={`font-mono tabular-nums ${className}`}
      aria-label={time ? `Local time in Lahore ${time}` : "Local time in Lahore"}
    >
      {time ?? "--:--"}
    </time>
  );
}
