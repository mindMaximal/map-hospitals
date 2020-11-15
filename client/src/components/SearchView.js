import React from 'react'
import './SearchView.scss'

export const SearchView = (props) => {
  return (
    <div className="search-view">

      <div className="search-view__info">

        <div className="search-view__title">
          <a className="search-view__link" href="#">{props.name}</a>
        </div>

        <div className="search-view__text">
          {props.text}
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