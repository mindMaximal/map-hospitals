import React, {useCallback, useEffect, useState} from 'react'
import './SingleView.scss'
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import getAddress from "../functions/getAddress"
import {useHttp} from "../hooks/http.hook"
import {Button, Preloader} from "react-materialize"
import {Link} from "react-router-dom"
import {SingleViewCard} from "./SingleViewCard";

export const SingleViewOrg = (props) => {

  const [state, setState] = useState({
    el: null
  })

  const [objects, setObjects] = useState([])

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      const fetched = await request('/api/map/org', 'POST', body)

      setState({
        el: fetched
      })

      const fetchedObjects = await request('api/map/org/objects', `POST`, body)

      console.log('fetchedObjects', fetchedObjects)

      setObjects(fetchedObjects)

      props.updateData(fetchedObjects)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData({
      id: props.id
    })
  }, [props.id])

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

                {state.el.organization || 'Неизвестно'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  ОГРН:
                </div>

                {state.el.ogrn || 'неизвестно'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  КПП:
                </div>

                {state.el.kpp || 'неизвестно'}

              </div>

              <div className="single-view__elem">

                <div className="single-view__subtitle single-view__subtitle--inline">
                  Телефон:
                </div>

                {state.el.phone || 'неизвестно'}

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

            { objects && objects.length > 0 &&
            <div className="single-view__block">

              <div className="single-view__subtitle single-view__subtitle--inline">
                Подчиненные мед. пункты:
              </div>

              {objects.map((el, i) => (
                    <SingleViewCard
                      key={i}
                      element={el}
                    />
                  )
              )}

            </div>
            }

          </div>

        </div>
      }



    </div>
  )
}