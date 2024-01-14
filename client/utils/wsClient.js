// path/filename: /client/utils/wsClient.js

import {
    authUser
} from './userAuth';

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function () {
    const token = authUser.getToken();
    if (token) {
        sendMessage('authentication', { token });
    }

    authUser.authChanges.subscribe(authDetails => {
        if (authDetails.token) {
            sendMessage('authentication', { token });
        } else {
            sendLogout();
        }
    });
    console.log('WebSocket Client Connected');
};

const parseMessage = (message) => {
    try {
        return JSON.parse(message);
    } catch (e) {
        console.error('Invalid JSON', e);
        return null;
    }
};
ws.onmessage = function (event) {
    const message = parseMessage(event.data);
    console.log('Received:', message);
    // Handle incoming messages
};
ws.onerror = function (error) {
    console.error('WebSocket Error:', error);
};
ws.onclose = function (e) {
    authDetails.unsubscribe();
    console.log('WebSocket Client Disconnected:', e.reason);
};

export const sendMessage = (type, data = {}) => {
    ws.send(JSON.stringify({ type, data }));
}
export const sendLogout = () => {
    sendMessage('logout');
}

export default ws;
