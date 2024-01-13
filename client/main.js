// path/filename: /client/main.js

import './style.css'
import { signinButtonHTML } from './utils/userAuth.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div class="card">
      ${signinButtonHTML()}
    </div>
  </div>
`
