// path/filename: /server/utils/auth.js

import { OAuth2Client } from google-auth-library
import env from './env';

const CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userName = payload.name;
  console.log("verify", payload)
}

export {
    verify
}