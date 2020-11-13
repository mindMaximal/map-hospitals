import React from 'react'
import './Sidebar.scss'

export const Sidebar = () => {
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

          </div>

        </div>

      </div>

    </div>
  )
}