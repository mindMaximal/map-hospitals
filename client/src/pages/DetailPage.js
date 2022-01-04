import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {useHistory, useParams} from "react-router-dom"
import './DetailPage.scss'
import getAddress from "../functions/getAddress";
import {InlineGallery} from "../components/InlineGallery"
import {Map, Placemark, YMaps} from "react-yandex-maps"
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'

export const DetailPage = () => {
  const {loading, error, request, clearError} = useHttp()

  const history = useHistory()

  const [data, setData] = useState({})

  let { id } = useParams()

  useEffect(() => {
    console.log(error)
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request(`/api/detail/${id}`, 'GET', null)
      // ToDo: Добавить проверку авторизации токена 2:40:18

      setData(fetched[0])
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  const getPointData = () => {
    return {
      clusterCaption: "placemark <strong>" + "</strong>"
    };
  };

  const getPointOptions = (el) => {
    return {
      preset: 'islands#violetIcon',
      iconColor: el.active === true ? '#e20101' : '#26a69a'
    };
  };

  return (
    <div className="detail">

        <div className="container">

          <div className="detail__back">
            <button
              className="detail__back-button"
              onClick={() => history.goBack()}
            >
              <span><ArrowBack /></span> Назад
            </button>
          </div>

          <div>
            Медицинский пункт:
          </div>

          <h1 className="detail__title">
            {data.name || 'Мед.пункт'}
          </h1>

          <div className="detail__block">

            <div className="detail__elem">
              Адрес:
            </div>

            {getAddress(data) || 'Неизвестно'}

          </div>

          <InlineGallery
            className="detail__gallery"
            id={id}
          />

          <div className="detail__block">

            <div className="detail__elem">
              Организация:
            </div>

            {data.parent || 'Неизвестно'}

          </div>

          <div className="detail__block">

            <div className="detail__elem">
              Аптека:
            </div>

            {parseInt(data.pharmacy) === 1 ? 'есть' : 'отстуствует'}

          </div>

          <div className="detail__block">

            <div className="detail__elem">
              Первая помощь:
            </div>

            {parseInt(data.access_to_primary_health_care) === 1 ? 'есть' : 'отстуствует'}

          </div>

          <div className="detail__block">

            <div className="detail__elem">
              Экстренная помощь:
            </div>

            {parseInt(data.availability_of_emergency_mediical_care) === 1 ? 'есть' : 'отстуствует'}

          </div>

          <div className="detail__block">

            <div className="detail__elem">
              Укомплектованность фельдшерами:
            </div>

            {data.staff || 0}

          </div>

        </div>

        <div className="container">

          <div className="detail__map">

            <YMaps>
              <Map
                state={{
                  zoom: 12,
                  'center': [data.latitude, data.longitude]
                }}
                className="detail__y-map"
              >

                <Placemark
                  geometry={[data.latitude, data.longitude]}
                  properties={getPointData(data)}
                  options={getPointOptions(data)}
                  modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                />

              </Map>

            </YMaps>

          </div>

        </div>

    </div>
  )
}