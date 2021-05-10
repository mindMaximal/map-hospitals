import React, {useCallback, useEffect, useState} from 'react'
import './SingleView.scss'
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import getAddress from "../functions/getAddress";
import {useHttp} from "../hooks/http.hook";
import {Preloader} from "react-materialize";
import {Gallery} from "./Gallery";

/*
*   ToDO
*    - Фикс скролла ненужного
*
* */

export const SingleView = (props) => {

  const [state, setState] = useState({
    el: null
  })

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

      const fetched = await request('/api/map/single', 'POST', body)

      console.log('SingleView fetched', fetched)

      setState({
        el: fetched
      })

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData({
      id: props.id
    })
  }, [fetchData])

  return (
    <div className="single-view">

      {
        loading ?
          <div className="single-view__loader">
            <Preloader
              active
              color="blue"
              flashing={false}
              size="small"
            />
          </div> :
          state.el && <div className="single-view__wrapper">

          <div className="single-view__info">

            <div className="single-view__block single-view__header">

              <div className="single-view__title">

                <button
                  className="single-view__button single-view__button--back"
                  onClick={props.back}
                >
                  <ArrowBack />
                </button>

                {state.el.name_Med_punkt}
              </div>

              {
                state.el.type_Med_punkt &&
                <div className="single-view__type">
                  {state.el.type_Med_punkt}
                </div>
              }


              <div className="single-view__schedule">
                {state.el.schedule || "График работы не указан"}
              </div>

            </div>

            <div className="single-view__block">

              <div className="single-view__elem single-view__address">

                <div className="single-view__subtitle">
                  Адрес:
                </div>

                {getAddress(state.el) || "Адрес не указан"}
              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle">
                  Организация:
                </div>

                {state.el.parent}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Аптека:
                </div>

                {parseInt(state.el.Pharmacy) === 1 ? 'есть' : 'отстуствует'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Первая помощь:
                </div>

                {parseInt(state.el.Access_to_primary_health_care) === 1 ? 'есть' : 'отстуствует'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Экстренная помощь:
                </div>

                {parseInt(state.el.Availability_of_emergency_mediical_care) === 1 ? 'есть' : 'отстуствует'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Укомплектованность фельдшерами:
                </div>

                {state.el.staff || 0}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Год основания:
                </div>

                {state.el.Founding_year || 'неизвестно'}

              </div>

            </div>

            <Gallery
              photo={state.el.photo}
              id={state.el.id_Med_punkt}
            />

          </div>


        </div>
      }



    </div>
  )
}