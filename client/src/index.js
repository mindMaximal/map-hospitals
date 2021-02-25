import React from 'react'
import ReactDOM from 'react-dom'
import 'materialize-css/dist/css/materialize.min.css'
import App from './App'

document.documentElement.lang = 'ru'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)