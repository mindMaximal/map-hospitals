import React from 'react'
import {Icon} from "react-materialize"
import './GalleryItem.scss'

export const GalleryEditItem = (props) => {

  const handleImgDeleteButton = (e) => {
    const img = e.target.closest('.gallery-item').querySelector('img')

    props.setDeletedImg({
      id: props.id,
      src: img.src
    })
  }

  return (
    <div
      className={`gallery-item gallery-item--edit ${props.className}`}
    >
      <img
        alt="Photo"
        src={'../attached/images/' + props.img}
      />
      <div className="gallery-item__preview">
        <button
          className="gallery-item__button"
          onClick={props.onClick}
        >
          <Icon>search</Icon>
        </button>
        <button
          className="gallery-item__button modal-trigger"
          href="#modal-img-delete"
          onClick={handleImgDeleteButton}
        >
          <Icon>clear</Icon>
        </button>
      </div>
    </div>
  )
}