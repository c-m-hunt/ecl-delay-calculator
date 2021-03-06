import * as React from 'react'
import { render } from 'react-dom'
import './index.scss'
import 'bootstrap/dist/css/bootstrap.css'

import App from './components/App'

render(<App />, document.getElementById('root'))

window.addEventListener('beforeinstallprompt', (e: any) => {
  e.prompt()
})
