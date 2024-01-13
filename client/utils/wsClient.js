// path/filename: /client/utils/wsClient.js

import {
    getToken,
    authChanges
} from './userAuth';

export default function wsClient() {
    let googleIdToken = getToken();
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function () {
        authChanges.subscribe(authDetails => {
            setToken(authDetails.token)
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

    const setToken = (token) => {
        googleIdToken = token;
        ws.send(JSON.stringify({ token: googleIdToken }));
    }

    const sendMessage = (message) => {
        ws.send(message);
    }

    return {
        setToken,
        sendMessage,
    };
}