// path/filename: /client/components/Login.js

import { Component } from '../core';
import { authUser, googleClientId } from '../utils/userAuth.js';

const Login = new Component();

const updateLoginState = () => {
  Login.setState({
    user: authUser.getUser(),
    signedIn: authUser.isSignedIn(),
    googleClientId,
  })
}

Login.onMount = () => {
  authUser.initLogin();
}

Login.onRender = (content, { signedIn }) => {
  if (signedIn) {
    const logoutButton = content.querySelector('#signOut');
    logoutButton.addEventListener('click', () => {
      authUser.signOut()
    });
  } else {
    const promptBox = document.querySelector("#credential_picker_container");
    if(!promptBox) {
      authUser.promptLogin();
    }
    const loginButton = content.querySelector('#promptLogin');
    loginButton.addEventListener('click', () => {
      console.log('Login clicked')
      authUser.promptLogin();
    });
  }
}

updateLoginState();
authUser.authChanges.subscribe(() => {
  updateLoginState();
});

Login.template = ({ user, signedIn, googleClientId }) => {
  if (signedIn) {
    return `
    <div class="user-card">
      <div class="user-greeting">${user?.picture && `<img src="${user.picture}" />`} ${user.given_name}</div>
      <button id="signOut">Sign Out</button>
    </div>
    `
  }
  return `
  <div class="google-login">
    <div id="g_id_onload"
      data-client_id="${googleClientId}"
      data-context="use"
      data-ux_mode="popup"
      data-login_uri="/"
      data-auto_prompt="false"
      data-itp_support="true"
      >
      <button id="promptLogin">Show Login</button>
    </div>
  </div>
  `
  // <div class="g_id_signin"
  //   data-type="standard"
  //   data-shape="pill"
  //   data-theme="filled_black"
  //   data-text="continue_with"
  //   data-size="large"
  //   data-logo_alignment="left">
  // </div>

}


export default Login;