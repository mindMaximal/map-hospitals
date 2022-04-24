import React from 'react'
import './SingleViewRateCard.scss'

export const SingleViewRateCard = (props) => {

  return (
    <div
      className="rate-card"
    >
      <div className="rate-card__name">
        <b>Должность:</b> {props.element.position || 'Неизвестно'}
      </div>

      <div className="rate-card__rate">
        <b>Занято ставок:</b> {props.element.rate_occupied}
      </div>

      <div className="rate-card__rate">
        <b>Всего ставок:</b> {props.element.rate_full}
      </div>

    </div>
  )
}