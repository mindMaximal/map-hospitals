import React, {useCallback, useEffect, useState} from 'react'
import './SingleView.scss'
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import getAddress from "../functions/getAddress"
import {useHttp} from "../hooks/http.hook"
import {Button, Preloader} from "react-materialize"
import {Link} from "react-router-dom"
import {SingleViewRateCard} from "./SingleViewRateCard";

export const SingleView = (props) => {

  const [state, setState] = useState({
    el: null
  })
  const [rates, setRates] = useState([])
  const [hasError, setHasError] = useState(false)

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
      setHasError(true)
    } else {
      setHasError(false)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      const fetched = await request('/api/map/single', 'POST', body)

      setState({
        el: fetched
      })

      const fetchedRates = await request('/api/map/single/rates', 'POST', body)

      setRates(fetchedRates)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData({
      id: props.id
    })
  }, [props.id])

  return (
    <div className="single-view">

      { hasError ?
        <div className="single-view__error">
          Произошла ошибка, <br/> перезагрузите страницу
        </div>
        :
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

              <button
                className="single-view__button single-view__button--back"
                onClick={props.back}
              >
                <ArrowBack />
              </button>

              <div className="single-view__title">
                {state.el.name}
              </div>

              {
                state.el.type_name &&
                <div className="single-view__type">
                  {state.el.type_name}
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

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Организация:
                </div>

                {state.el.facility_name || 'Неизвестно'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Аптека:
                </div>

                {parseInt(state.el.pharmacy) === 1 ? 'есть' : 'отстуствует'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Первая помощь:
                </div>

                {parseInt(state.el.access_to_primary_health_care) === 1 ? 'есть' : 'отстуствует'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Экстренная помощь:
                </div>

                {parseInt(state.el.availability_of_emergency_mediical_care) === 1 ? 'есть' : 'отстуствует'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Укомплектованность:
                </div>

                {state.el.staffing ? (state.el.staffing * 100) + '%' : 'Неизвестно'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Год основания:
                </div>

                {state.el.founding_year || 'неизвестно'}

              </div>

            </div>

            {/* ToDo: починить галерею
            <Gallery
              id={state.el.id}
            />*/}

            <div className="single-view__block">

              <Link
                to={`/detail/${state.el.id}`}
                target="_blank"
              >
                <Button
                  node="button"
                  style={{
                    marginRight: '5px'
                  }}
                  waves="light"
                >
                  Подробнее
                </Button>
              </Link>

            </div>

            {rates && rates.length > 0 &&
              <div className="single-view__block">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Укомплектованность:
                </div>

                  {rates.map((el, i) => (
                    <SingleViewRateCard
                      key={i}
                      element={el}
                    />
                  ))}

                </div>
            }

          </div>

        </div>
      }



    </div>
  )
}