import React from 'react'
import {Icon} from "react-materialize"
import './GalleryItem.scss'

export const GalleryItem = (props) => {

  return (
    <div
      className={`gallery-item ${props.className}`}
    >
      <img
        alt="Photo"
        src={'../attached/images/' + props.img}
      />
      <div
        className="gallery-item__preview"
        onClick={props.onClick}
      >
        <button
          className="gallery-item__button"
        >
          <Icon>search</Icon>
        </button>
      </div>
    </div>
  )
}