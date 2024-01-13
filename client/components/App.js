import { Component } from '../core';
import { authUser } from '../utils/userAuth.js';
import Login from './Login.js';

const App = new Component({
    Login
});

App.template = () => {
  return `
    <div>
      <div class="card">
      </div>
    </div>
    <slot component="Login" />
  `
}


export default App;