import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const AdminPage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext)

  const logoutHandler = (event) => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <ul>
        <li><NavLink to="/">Карта</NavLink></li>
        <li><button
          onClick={logoutHandler}
        >
          Выйти
        </button></li>
      </ul>
    </div>
  )
}