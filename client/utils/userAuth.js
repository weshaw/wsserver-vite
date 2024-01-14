// path/filename: /client/utils/userAuth.js

import { jwtDecode } from "jwt-decode";
import env from "../env";
import AppEvent from "../../shared/event";
import watcher from "../core/watcher";

const { googleClientId } = env;

const authDetailsInitialState = () => ({
  user: null,
  token: null,
})

function AuthUser() {
  let initialized = false;
  const authChanges = new AppEvent();
  const authDetails = watcher(authDetailsInitialState(), authChanges.debouncedNotify);
  const googleAccount = () => window.google?.accounts?.id;

  const credentialResponse = async (response) => {
    if ("credential" in response) {
      sessionStorage.setItem('googleIdToken', response.credential);
      updatAuthDetails()
    }
    else {
      signOut();
      console.log("User cancelled login or did not fully authorize.");
      console.error(response);
    }
  };

  const updatAuthDetails = async () => {
    const token = sessionStorage.getItem('googleIdToken') || null;
    if (!token) {
      signOut();
      return;
    }
    authDetails.token = token;
    authDetails.user = jwtDecode(token);
    promptLogin();
  };

  const signOut = () => {
    sessionStorage.removeItem('googleIdToken');
    authDetails.token = null;
    authDetails.user = null;
    const ga = googleAccount();
    if (ga) {
      ga.disableAutoSelect();
      ga.prompt();
    }
  };

  const isSignedIn = () => {
    return !!authDetails.token;
  }
  const getToken = () => {
    return authDetails.token;
  }
  const getUser = () => {
    return authDetails?.user || {
      name: "Guest",
    };
  }
  const promptLogin = () => {
    if (!isSignedIn()) {
      document.cookie = 'g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      googleAccount().prompt();
    }

  }

  const initLogin = () => {
    if (!googleAccount()) {
      setTimeout(() => initLogin(), 100);
      return;
    }
    if (!initialized) {
      initialized = true;
      googleAccount().initialize({
        client_id: googleClientId,
        callback: authUser.credentialResponse
      });
    }
    promptLogin();
  }
  // Initialize auth details
  updatAuthDetails();

  return {
    initLogin,
    credentialResponse,
    isSignedIn,
    getToken,
    getUser,
    signOut,
    authChanges,
    promptLogin,
  }
}

const authUser = new AuthUser();

export {
  authUser,
  googleClientId
}