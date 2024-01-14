// path/filename: /client/utils/userAuth.js

import { jwtDecode } from "jwt-decode";
import env from "../env";
import AppEvent from "../../shared/event";

const { googleClientId } = env
const google = window.google;

const authDetailsInitialState = () => ({
  user: null,
  token: null,
})

function AuthUser() {
  let initialized = false;
  const authChanges = new AppEvent();
  let authDetails = authDetailsInitialState()

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
    if(!token) {
      signOut();
      return;
    }
    authDetails.token = token;
    authDetails.user = jwtDecode(token);
    authChanges.notify(authDetails);
  };

  const signOut = () => {
    sessionStorage.removeItem('googleIdToken');
    google.accounts.id.disableAutoSelect();
    authDetails = authDetailsInitialState();
    authChanges.notify(authDetails);
    google.accounts.id.prompt();
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

  const initLogin = () => {
    if(initialized) {
      return;
    }
    initialized = true;
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: authUser.credentialResponse
    });
    if(!isSignedIn()) {
      google.accounts.id.prompt();
    }
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
  }
}

const authUser = new AuthUser();

export {
  authUser,
  googleClientId
}