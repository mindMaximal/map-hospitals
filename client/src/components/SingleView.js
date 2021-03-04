import React from 'react'
import './SingleView.scss'
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'

/*
*   ToDO
*    - Фикс скролла ненужного
*
* */

export const SingleView = (props) => {

  console.log(props.elem)

  return (
    <div className="single-view">

      <div className="single-view__info">

        <div className="single-view__block single-view__header">

          <div className="single-view__title">

            <button
              className="single-view__button single-view__button--back"
              onClick={props.back}
            >
              <ArrowBack />
            </button>

            {props.elem.name}
          </div>

          <div className="single-view__type">
            Фельдшерско-акушерский пункт
          </div>

          <div className="single-view__schedule">
            {props.elem.schedule || "График работы не указан"}
          </div>

        </div>

        <div className="single-view__block">

          <div className="single-view__elem single-view__address">

            <div className="single-view__subtitle">
              Адрес:
            </div>

            {props.elem.address || "Адрес не указан"}
          </div>

          <div className="single-view__elem">

            <div className="single-view__subtitle">
              Организация:
            </div>

            {props.elem.parent}

          </div>

          <div className="single-view__elem">

            <div className="single-view__subtitle single-view__subtitle--inline">
              Аптека:
            </div>

            {props.elem.pharmacy ? 'есть' : 'отстуствует'}

          </div>

          <div className="single-view__elem">

            <div className="single-view__subtitle single-view__subtitle--inline">
              Первая помощь:
            </div>

            {props.elem.firstAid ? 'есть' : 'отстуствует'}

          </div>

          <div className="single-view__elem">

            <div className="single-view__subtitle single-view__subtitle--inline">
              Экстренная помощь:
            </div>

            {props.emergencyAssistance ? 'есть' : 'отстуствует'}

          </div>

          <div className="single-view__elem">

            <div className="single-view__subtitle single-view__subtitle--inline">
              Укомплектованность фельдшерами:
            </div>

            {props.elem.staff || 0}

          </div>

          <div className="single-view__elem">

            <div className="single-view__subtitle single-view__subtitle--inline">
              Год основания:
            </div>

            {props.foundationYear || 'неизвестно'}

          </div>

        </div>

      </div>

      {props.elem.photo &&
      <div className="single-view__photo">
        <img src={props.elem.photo} alt="Photo"/>
      </div>
      }

    </div>
  )
}