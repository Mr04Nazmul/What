# Local Football Live Score

A TypeScript starter for real-time local football match scores using Socket.io.

## Included
- `components/MatchCard.tsx`: match card
- `components/BetSlip.tsx`: legacy filename for a **score sheet** (no wagers, odds, or payments)
- `server/socket.ts`: Node.js Socket.io broadcast server

## Setup
Install client packages `react`, `react-dom`, `socket.io-client` and server packages `socket.io`, `typescript`, `tsx`, `@types/node` in your React/Node project. For example, run `npm install socket.io socket.io-client` and `npm install -D typescript tsx @types/node`.

Run the server with `npx tsx server/socket.ts` and set `CLIENT_ORIGIN` to your frontend's URL if needed. Render `<BetSlip serverUrl="http://localhost:4000" matchId="local-final" />` from a React page.

The server is a starter: it broadcasts updates supplied from trusted server-side match scoring code. It does not fetch external live scores and has no data persistence.
