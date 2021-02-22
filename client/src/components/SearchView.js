import React from 'react'
import './SearchView.scss'

export const SearchView = (props) => {
  return (
    <div
      className="search-view"
      onClick={props.searchViewClick}
    >

      <div className="search-view__info">

        <div className="search-view__title">
          <a className="search-view__link" href="#">{props.name}</a>
        </div>

        <div className="search-view__address">
          {props.addres || "Адрес не указан"}
        </div>

        <div className="search-view__schedule">
          {props.schedule || "График работы не указан"}
        </div>

      </div>

      {props.photo &&
        <div className="search-view__photo">
          <img src={props.photo} alt="Photo"/>
        </div>
      }

    </div>
  )
}