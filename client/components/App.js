// path/filename: /client/components/App.js

import { Component } from '../core';
import Login from './Login.js';

const App = new Component({
    Login
});

App.template = () => {
  return `
    <div>
        <div class="card">
        </div>
        <Component name="Login" />
    </div>
  `
}


export default App;