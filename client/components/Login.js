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
  <div id="g_id_onload"
    data-client_id="${googleClientId}"
    data-context="use"
    data-ux_mode="popup"
    data-login_uri="/"
    data-auto_prompt="false">
  </div>
  `
}


export default Login;