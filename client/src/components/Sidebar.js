import React, {useCallback, useEffect, useState} from 'react'
import {ListView} from './ListView'
import magnifer from '../img/magnifier.svg'
import {useHttp} from "../hooks/http.hook";
import './Sidebar.scss'

export const Sidebar = () => {

  const {loading, error, request, clearError} = useHttp()
  const [data, setData] = useState([])

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/map', 'POST')
      setData(fetched.data)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    console.log('Loading')
  }

  const list = [
    {
      name: 'name 1',
      text: 'text 1',
      photo: 'photo 1'
    },
    {
      name: 'name 2',
      text: 'text 2'
    },
    {
      name: 'name 3',
      text: 'text 3',
      photo: 'photo 3'
    }
  ]


  return (
    <div className="sidebar">

      <div className="sidebar__wrapper">

        <div className="sidebar__header">

          <div className="sidebar__search">

            <input
              type="text"
              placeholder="Поиск"
              className="sidebar__input"
            />

            <button
              className="sidebar__button sidebar__button--search"
            >
              <img src={magnifer} alt="Поиск"/>
            </button>

          </div>

        </div>
        {!loading && <ListView list={data}/>}

      </div>

    </div>
  )
}