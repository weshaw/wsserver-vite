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
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const menuLinks = document.querySelectorAll('#userMenuDropdown a');
    [...menuLinks].map(link => link.addEventListener('click', (e) => {
      e.preventDefault();
      console.dir( e.target)
      const action = e.target.href.split('#').at(-1);
      if (action === 'logout') {
        authUser.signOut();
      }
    }));
    userMenuButton.addEventListener('click', (e) => {
      e.preventDefault();
      userMenuDropdown.classList.toggle('hidden');
    });
  } else {
    const promptBox = document.querySelector("#credential_picker_container");
    if (!promptBox) {
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
    <div class="app-menu-container inner-container flex items-center">
      <button id="userMenuButton" class="flex items-center focus:outline-none">
          ${user?.picture && `<img src="${user.picture}" class="h-8 w-8 rounded-full mr-2" />`}
          <span class="text-white">${user.given_name}</span>
      </button>
      <div id="userMenuDropdown" class="app-menu menu-right bg-slate-700 rounded-lg shadow-xl hidden">
        <a href="#logout" class=" hover:bg-slate-600 rounded-lg">Logout</a>
      </div>
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
  //   data-theme="transparent"
  //   data-text="continue_with"
  //   data-size="large"
  //   data-logo_alignment="left">
  // </div>

}


export default Login;