// path/filename: /client/main.js

import './css/index.css';

import ws from './utils/wsClient.js'
import Login from './components/Login.js'
import env from './env.js';

console.log(env);
Login.appendTo(document.querySelector('#user-panel'));
