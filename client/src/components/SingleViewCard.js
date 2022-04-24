import React from 'react'
import './SingleViewCard.scss'
import getAddress from "../functions/getAddress"

export const SingleViewCard = (props) => {

  return (
    <a
      href={`/detail/${props.element.id}`}
      className="single-view-card"
      target="_blank"
    >
      <div className="single-view-card__name">
        {props.element.name}
      </div>

      <div className="single-view-card__address">
        {getAddress(props.element) || "Адрес не указан"}
      </div>

    </a>
  )
}