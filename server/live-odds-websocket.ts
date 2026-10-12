// server.ts
import { Server } from 'socket.io';
import http from 'http';
import app from './app';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Simulate Live Odds Update (Every 5 seconds)
setInterval(() => {
    const randomMatchId = Math.floor(Math.random() * 100) + 1;
    const newOdds = {
        home: (1.5 + Math.random()).toFixed(2),
        draw: (3.0 + Math.random()).toFixed(2),
        away: (2.0 + Math.random()).toFixed(2)
    };

    io.emit('odds_update', { matchId: randomMatchId, odds: newOdds });
}, 5000);

server.listen(3000, () => console.log('Server running on 3000'));
