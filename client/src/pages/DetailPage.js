import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {useHistory, useParams} from "react-router-dom"
import './DetailPage.scss'
import getAddress from "../functions/getAddress";
import {InlineGallery} from "../components/InlineGallery"
import {Map, Placemark, YMaps} from "react-yandex-maps"
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import {Button, Modal, Preloader} from "react-materialize"
import {Box} from "../components/Skeleton"
import {InlineRates} from "../components/InlineRates";

export const DetailPage = () => {
  // ToDo: 404 на несуществующий
  const {loading, error, request, clearError} = useHttp()

  const history = useHistory()

  const [data, setData] = useState({})
  const [deletedData, setDeletedData] = useState(false)

  let { id } = useParams()

  useEffect(() => {
    console.log(error)
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request(`/api/detail/${id}`, 'GET', null)
      // ToDo: Добавить проверку авторизации токена 2:40:18
      if (fetched.length === 0) {
        history.push('/error')
      }

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

  const fetchDelete = useCallback(async (body) => {
    try {
      const fetched = await request(`/api/detail/delete`, 'POST', body)
      // ToDo: Добавить проверку авторизации токена 2:40:18 на удаление!

      console.log('Deleted fetch', fetched)
      setDeletedData(true)

      setTimeout(() => {
        history.push('/view')
      }, 5000)
    } catch (e) {}
  }, [request])

  const handleDeleteModalButton = (id) => {
    fetchDelete({id})
  }

  const handleBackButtonClick = () => {
    if (history.length > 1) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <div className="detail">

      <Scrollbars>

        <div className="detail__wrapper">

          <div className="container">

            <div className="detail__controls">

              <div className="detail__back">
                <button
                  className="detail__back-button"
                  onClick={handleBackButtonClick}
                >
                  <span><ArrowBack /></span> {history.length > 1 ? 'Назад' : 'Главная'}
                </button>
              </div>

              <div className="details_buttons">

                <Button
                  className="detail__button"
                  node="button"
                  waves="light"
                  disabled={loading}
                  onClick={() => history.push(`/edit/${data.id}`)}
                  >
                  Изменить
                </Button>

                <Button
                  className="modal-trigger red darken-3 detail__button"
                  href="#modal-delete"
                  node="button"
                  waves="light"
                  disabled={loading}
                >
                  Удалить
                </Button>

              </div>

            </div>

            { loading ?
              <div>
                <Box width={15}/>
              </div> :
              <>
                <div>
                  Медицинский пункт:
                </div>
              </>
            }

            <h1 className="detail__title">
              { loading ?
                <div className="detail__title--replace">
                  <Box width={100} />
                  <Box width={87} />
                </div> :
                data.name || 'Мед.пункт'
              }
            </h1>

            <div className="detail__block">

              { loading ?
                <div>
                  <Box width={50}/>
                </div> :
                <>
                  <div className="detail__elem">
                    Адрес:
                  </div>

                  {getAddress(data) || 'Неизвестно'}
                </>
              }

            </div>

            <div className="detail__map">

              { loading ?
                <div className="detail__preloader">
                  <Preloader
                    active
                    color="blue"
                    flashing={false}
                    size="small"
                  />
                </div> :

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

              }

            </div>

            <div className="detail__info">

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={30}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Организация:
                    </div>

                    {data.parent || 'Неизвестно'}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={32}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Тип:
                    </div>

                    {data.type_name || 'Неизвестно'}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={23}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Телефон:
                    </div>

                    {data.phone || 'Неизвестно'}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={20}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Аптека:
                    </div>

                    {parseInt(data.pharmacy) === 1 ? 'есть' : 'отстуствует'}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={25}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Первая помощь:
                    </div>

                    {parseInt(data.access_to_primary_health_care) === 1 ? 'есть' : 'отстуствует'}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={18}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Экстренная помощь:
                    </div>

                    {parseInt(data.availability_of_emergency_mediical_care) === 1 ? 'есть' : 'отстуствует'}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={31}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Укомплектованность фельдшерами:
                    </div>

                    {data.staffing ? Math.round(data.staffing * 100) + '%' : 0}
                  </>
                }

              </div>

              <div className="detail__block">

                { loading ?
                  <div>
                    <Box width={35}/>
                  </div> :
                  <>
                    <div className="detail__elem">
                      Год основания:
                    </div>

                    {data.founding_year || 'Неизвестно'}
                  </>
                }

              </div>

            </div>

          </div>

          <div className="container">

            <InlineGallery
              className="detail__gallery"
              loading={loading}
              id={id}
            />

          </div>

          <div className="container">

            <InlineRates
              className="detail__rates"
              loading={loading}
              id={id}
            />

          </div>

        </div>

      </Scrollbars>

      <Modal
        actions={
          deletedData ?
            [
              <Button
              node="button"
              waves="green"
              onClick={async () => { history.push('/view')}}
            >
              Закрыть
            </Button>
            ] :
            [
            <Button
              className="modal-trigger red darken-3"
              node="button"
              waves="light"
              style={{
                marginRight: '5px'
              }}
              disabled={loading}
              onClick={() => handleDeleteModalButton(data.id)}
            >
              Да
            </Button>,
            <Button
              modal="close"
              node="button"
              waves="green"
              disabled={loading}
            >
              Нет
            </Button>
          ]
        }
        bottomSheet={false}
        fixedFooter={false}
        header={deletedData ? "Мед. пункт был удален" : "Вы действительно хотите удалить этот мед. пункт?"}
        id="modal-delete"
        open={false}
        options={{
          dismissible: true,
          endingTop: '30%',
          opacity: 0.5,
          outDuration: 250,
          preventScrolling: true,
          startingTop: '20%'
        }}
      >
        <div>
          {deletedData ?
            <div>
              Мед. пункт <strong>{data.name}</strong> удален!<br/> Через 5 секунд вы будете перенаправлены на страницу "Таблица"
            </div> :
          <div>
            Будет удален следующий мед. пункт: <br/> <strong>{data.name}</strong>
          </div>
          }
        </div>
      </Modal>

    </div>
  )
}