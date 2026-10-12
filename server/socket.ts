import { createServer } from "node:http";
import { Server } from "socket.io";

export type MatchUpdate = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: "scheduled" | "live" | "finished";
};

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" },
});
const matches = new Map<string, MatchUpdate>();

io.on("connection", (socket) => {
  socket.on("match:join", (matchId: unknown) => {
    if (typeof matchId !== "string" || !/^[a-zA-Z0-9_-]{1,60}$/.test(matchId)) return;
    socket.join(`match:${matchId}`);
    const current = matches.get(matchId);
    if (current) socket.emit("match:update", current);
  });
});

// Call from trusted server-side scoring logic. Do not accept anonymous score writes.
export function publishMatchUpdate(update: MatchUpdate) {
  matches.set(update.matchId, update);
  io.to(`match:${update.matchId}`).emit("match:update", update);
}

export function startLiveScoreServer(port = Number(process.env.PORT || 4000)) {
  httpServer.listen(port, () => console.log(`Live football scores on port ${port}`));
}
if (require.main === module) startLiveScoreServer();
