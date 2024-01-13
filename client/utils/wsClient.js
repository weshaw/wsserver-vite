// path/filename: /client/utils/wsClient.js

import {
    authUser
} from './userAuth';


export default function wsClient() {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function () {
        const token = authUser.getToken();
        if (token) {
            sendAuthenticated(token);
        }

        authUser.authChanges.subscribe(authDetails => {
            if (authDetails.token) {
                sendAuthenticated(authDetails.token);
            } else {
                sendLogout();
            }
        });
        console.log('WebSocket Client Connected');
    };
    ws.onmessage = function (e) {
        console.log('Received:', e.data);
        // Handle incoming messages
    };
    ws.onerror = function (error) {
        console.error('WebSocket Error:', error);
    };
    ws.onclose = function (e) {
        authDetails.unsubscribe();
        console.log('WebSocket Client Disconnected:', e.reason);
    };

    const sendMessage = (type, data = {}) => {
        ws.send(JSON.stringify({ type, data }));
    }
    function sendAuthenticated(token) {
        sendMessage('authentication', { token });
    }
    function sendLogout() {
        sendMessage('logout');
    }

    return {
        setToken,
        sendMessage,
        sendLogout,
    };
}