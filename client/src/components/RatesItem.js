import React from 'react'
import './RatesItem.scss'


export const RatesItem = (props) => {

  return (
    <div className={`rates-item ${props.className}`}>

      <div className="rates-item__content">

        <div className="rates-item__title">
          <b>Должность:</b> {props.el.position || 'Неизвестно'}
        </div>

        <div>

          <div className="">
            <b>Ставок занято:</b> {props.el.rate_occupied}
          </div>

          <div className="">
            <b>Ставок всего:</b> {props.el.rate_full}
          </div>

        </div>

      </div>

      <div className="rates-item__percent">
        {Math.round(props.el.rate_occupied / props.el.rate_full * 100) + '%'}
      </div>

    </div>
  )
}