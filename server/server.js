// path/filename: /server/server.js

import { WebSocketServer } from 'ws';
import { OAuth2Client } from 'google-auth-library';
import env from './utils/env';

const CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
    console.error('Google Client ID not found. Ensure it is set in .env file.');
    process.exit(1);
}

const client = new OAuth2Client(CLIENT_ID);
const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  return payload;
}

wss.on('connection', async function connection(ws, req) {
  try {
    const token = req.url.split('token=')[1]; 
    if (!token) {
      ws.close(4000, 'No token provided');
      return;
    }

    const user = await verifyToken(token);
    if (!user) {
      ws.close(4001, 'Invalid token');
      return;
    }

    clients.add(ws);
    console.log(`Client authenticated. Total clients: ${clients.size}`);

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`Client disconnected. Total clients: ${clients.size}`);
    });

    ws.on('message', function message(data) {
      console.log('Received:', data);
    });

    ws.send('Welcome to the authenticated WebSocket server!');

  } catch (error) {
    console.error(error);
    ws.close(4002, 'Authentication failed');
  }
});

console.log('WebSocket server started on port 8080.');
