// path/filename: /server/utils/auth.js

import { OAuth2Client } from 'google-auth-library';
import env from '../env.js';

const CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
    console.error('Google Client ID not found. Ensure it is set in .env file.');
    process.exit(1);
}
const client = new OAuth2Client(CLIENT_ID);

export async function verifyToken(token) {
  if(!token) {
    console.error('Token verification error:', "token is missing");
    return null;
}
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}
