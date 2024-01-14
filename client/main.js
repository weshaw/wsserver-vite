// path/filename: /client/main.js

import './style.css'

import ws from './utils/wsClient.js'
import App from './components/App.js'

App.appendTo(document.querySelector('#app'));
