"use client";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

// Local football match score sheet (no betting or money transactions).
export type MatchUpdate = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: "scheduled" | "live" | "finished";
};

export default function BetSlip({
  serverUrl,
  matchId,
}: {
  serverUrl: string;
  matchId: string;
}) {
  const [match, setMatch] = useState<MatchUpdate | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io(serverUrl, { reconnection: true });
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("match:join", matchId);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("match:update", (next: MatchUpdate) => {
      if (next.matchId === matchId) setMatch(next);
    });
    return () => { socket.disconnect(); };
  }, [serverUrl, matchId]);

  return (
    <section aria-label="Football match score sheet">
      <h2>Football Match Score Sheet</h2>
      <p role="status">{connected ? "Live connection" : "Reconnecting…"}</p>
      {match ? (
        <>
          <strong>{match.homeTeam} {match.homeScore} – {match.awayScore} {match.awayTeam}</strong>
          <p>{match.status === "live" ? `Minute ${match.minute}` : match.status}</p>
        </>
      ) : <p>No match update received yet.</p>}
    </section>
  );
}
