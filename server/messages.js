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

    const processMessage = async (message) => {
        const messageData = parseMessage(message);
        console.log('Received:', messageData);
        if (!messageData) {
            send('error', { message: 'Invalid message format'});
            return;
        }
        const {type, data} = messageData;
        if (!clients.has(ws) && type !== `authentication`) {
            send("error", { message: "Unauthorized" });
        }
        switch (type) {
            case "authentication":
                const user = await verifyToken(data.token);
                if (user) {
                    clients.set(ws, { user });
                    send('authenticated', { message: 'Authentication successful', user });
                } else {
                    send("error", { message: "Invalid token" });
                    ws.close(4001, "Invalid token");
                }
                break;
            case "logout":
                clients.remove(ws);
                send('logged_out', { message:'You have been logged out' });
                break;
            default:
                const message = `Unknown message type: ${type}`;
                console.log(message);
                send('error', { message });

        }
    };

    return {
        processMessage,
        send,
        broadcast,
    }
}
