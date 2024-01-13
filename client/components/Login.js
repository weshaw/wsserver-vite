import { Component } from '../core';
import { authUser, googleClientId } from '../utils/userAuth.js';

const Login = new Component();

Login.onMount = () => {
  authUser.initLogin();
}

Login.onRender = (content, {signedIn}) => {
  if(signedIn) {
    console.log("Login rendered", content);
    const logoutButton = content.querySelector('#signOut');
    logoutButton.addEventListener('click', (e) => {
      authUser.signOut()
    });
  }
}

Login.setState({
  user: authUser.getUser(),
  signedIn: authUser.isSignedIn(),
  googleClientId,
})

authUser.authChanges.subscribe(authDetails => {
  console.log("authDetails", authDetails);
  Login.setState({
    user: authUser.getUser(),
    signedIn: authUser.isSignedIn(),
    })
})

Login.template = ({ user, signedIn, googleClientId }) => {
  if (signedIn) {
    return `
    <div>
      <div>
        <span>Welcome, ${user.name}</span>
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


export default Login;