import type { Vaccine } from "../types";
import { findNextVaccine } from "../utils/vaccine";
import { daysDiff, getToday } from "../utils/date";

interface StatsBarProps {
  vaccines: Vaccine[];
}

export function StatsBar({ vaccines }: StatsBarProps) {
  const doneCount = vaccines.filter((v) => v.done).length;
  const upcomingCount = vaccines.filter((v) => !v.done).length;
  const nextVaccine = findNextVaccine(vaccines);

  let nextText = "-";
  if (nextVaccine?.scheduled_date) {
    const d = daysDiff(getToday(), new Date(nextVaccine.scheduled_date));
    if (d > 0) {
      nextText = `${d} \u5929`;
    } else if (d === 0) {
      nextText = "\u4ECA\u5929!";
    } else {
      nextText = `\u903E\u671F ${Math.abs(d)} \u5929`;
    }
  }

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-number">{doneCount}</span>
        <span className="stat-label">{"\u5DF2\u5B8C\u6210"}</span>
      </div>
      <div className="stat">
        <span className="stat-number">{upcomingCount}</span>
        <span className="stat-label">{"\u5F85\u65BD\u6253"}</span>
      </div>
      <div className="stat">
        <span className="stat-number">{nextText}</span>
        <span className="stat-label">{"\u4E0B\u4E00\u5291"}</span>
      </div>
    </div>
  );
}
