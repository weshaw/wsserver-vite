// path/filename: /client/utils/userAuth.js

import { jwtDecode } from "jwt-decode";
import env from "./env";
import AppEvent from "../../shared/event";

const { googleClientId } = env

const authDetailsInitialState = () => ({
  user: null,
  token: null,
})

function AuthUser() {
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
    authDetails.token = token;
    authDetails.user = jwtDecode(token);
    authChanges.notify(authDetails);
  };

  const signOut = () => {
    sessionStorage.removeItem('googleIdToken');
    google.accounts.id.disableAutoSelect();
    authDetails = authDetailsInitialState();
    authChanges.notify(authDetails);
  };

  const isSignedIn = () => {
    return !!authDetails.token;
  }
  const getToken = () => {
    return authDetails.token;
  }
  const getUser = () => {
    return authDetails.user || {
      name: "Guest",
    };
  }

  // Initialize auth details
  updatAuthDetails();

  return {
    credentialResponse,
    isSignedIn,
    getToken,
    getUser,
    signOut,
    authChanges,
  }
}

const authUser = new AuthUser();

window.onload = function () {
  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: authUser.credentialResponse
  });
  if(!authUser.isSignedIn()) {
    google.accounts.id.prompt();
  }
  console.log(google.accounts)
};

function signinButtonHTML() {
  if (authUser.isSignedIn()) {
    return `
    <div>
      <div>
        <span>Welcome, ${authUser.getUser().name}</span>
        <button id="signOut">Sign Out</button>
      </div>
    </div>
    `
  }
  return `
  <div id="g_id_onload"
    data-client_id="${googleClientId}"
    data-context="use"
    data-ux_mode="popup"
    data-login_uri="/"
    data-auto_prompt="false">
  </div>
  `
}

export {
  signinButtonHTML,
  authUser,
}