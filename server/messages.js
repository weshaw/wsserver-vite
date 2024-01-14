// path/filename: /server/messages.js

import { verifyToken } from './utils/auth.js';

const parseMessage = (message) => {
    try {
        return JSON.parse(message);
    } catch (e) {
        console.error('Invalid JSON', e);
        return null;
    }
};

export const setupConnection = ({ ws, req, clients }) => {

    const send = (type, data) => {
        ws.send(JSON.stringify({ type, data }));
    };

    const broadcast = (type, data) => {
        clients.forEach((user, client) => {
            if (client !== ws) {
                client.send(JSON.stringify({ type, data }));
            }
        });
    };
    const sendError = (message, revieved) => {
        send('error', { message, revieved });
        console.log('error', { message, revieved })
    }
    const processMessage = async (message) => {
        const messageData = parseMessage(message);
        if (!messageData) {
            sendError('Invalid message format', messageData);
            return;
        }
        const {type, data} = messageData;
        if (!clients.has(ws) && type !== `authentication`) {
            sendError('Unauthorized', messageData);
        }
        switch (type) {
            case "authentication":
                const user = await verifyToken(data.token);
                if (user) {
                    clients.set(ws, { user });
                    send('authenticated', { user });
                } else {
                    sendError('Invalid token', messageData);
                }
                break;
            case "logout":
                clients.remove(ws);
                send('logged_out', { message:'You have been logged out' });
                break;
            default:
                const message = `Unknown message type: ${type}`;
                sendError(message, messageData);

        }
    };

    return {
        processMessage,
        send,
        broadcast,
    }
}
