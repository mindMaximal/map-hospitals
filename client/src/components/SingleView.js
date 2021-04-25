import React, {useCallback, useEffect, useState} from 'react'
import './SingleView.scss'
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import getAddress from "../functions/getAddress";
import {useHttp} from "../hooks/http.hook";

/*
*   ToDO
*    - Фикс скролла ненужного
*
* */

export const SingleView = (props) => {

  const [state, setState] = useState()

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      console.log('body', body)

      const fetched = await request('/api/reports', 'POST', body)

      setData(fetched)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

            {props.elem.name_Med_punkt}
          </div>

          {
            props.elem.type_Med_punkt &&
            <div className="single-view__type">
              {props.elem.type_Med_punkt}
            </div>
          }


          <div className="single-view__schedule">
            {props.elem.schedule || "График работы не указан"}
          </div>

        </div>

        <div className="single-view__block">

          <div className="single-view__elem single-view__address">

            <div className="single-view__subtitle">
              Адрес:
            </div>

            {getAddress(props.elem) || "Адрес не указан"}
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

            {props.elem.foundationYear || 'неизвестно'}

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