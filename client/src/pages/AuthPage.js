import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    console.log(error)
    clearError()
  }, [clearError, error])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const authHandler = async (event) => {
    event.preventDefault()
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div>
      <h1>Авторизуйтесь</h1>
      <form>

        <input
          type="text"
          name="email"
          placeholder="Введите email"
          onChange={changeHandler}
        />

        <input
          type="password"
          name="password"
          placeholder="Введите пароль"
          onChange={changeHandler}
        />

        <button
          type="submit"
          onClick={authHandler}
        >
          Отправить
        </button>

      </form>
    </div>
  )
}