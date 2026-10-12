import type { CSSProperties } from "react";

export type MatchCardProps = {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | string;
  awayScore?: number | string;
  competition?: string;
  startTime?: string;
  status?: "scheduled" | "live" | "finished";
  onClick?: () => void;
};

const cardStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 18,
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  background: "#fff",
  color: "#111827",
  fontFamily: "system-ui, sans-serif",
};

const teamsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
  fontSize: 16,
  fontWeight: 600,
};

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  competition,
  startTime,
  status = "scheduled",
  onClick,
}: MatchCardProps) {
  const hasScore = homeScore !== undefined && awayScore !== undefined;

  return (
    <article
      style={{
        ...cardStyle,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${homeTeam} versus ${awayTeam}, ${status}`}
    >
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, color: "#6b7280" }}>
        <span>{competition || "Match"}</span>
        <span aria-live={status === "live" ? "polite" : "off"}>
          {status === "live" ? "● LIVE" : status === "finished" ? "Full time" : startTime || "Upcoming"}
        </span>
      </header>

      <div style={teamsStyle}>
        <span style={{ flex: 1 }}>{homeTeam}</span>
        <strong style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          {hasScore ? `${homeScore} – ${awayScore}` : "vs"}
        </strong>
        <span style={{ flex: 1, textAlign: "right" }}>{awayTeam}</span>
      </div>
    </article>
  );
}
