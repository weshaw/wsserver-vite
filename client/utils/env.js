// path/filename: /client/utils/env.js
const env = import.meta.env;
export default {
    googleClientId: env.VITE_GOOGLE_CLIENT_ID,
};
