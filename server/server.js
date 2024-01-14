// path/filename: /server/server.js

import { WebSocketServer } from 'ws';

import clients from './clients.js';
import { setupConnection } from './messages.js';

const wss = new WebSocketServer({ port: 8080 });


wss.on('connection', async function connection(ws, req) {
  const { processMessage } = setupConnection({ws, req, clients})
  ws.on("message", processMessage);
  ws.on('close', function close() {
    clients.remove(ws);
  });
});


console.log('WebSocket server started on port 8080.');
