import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {useHistory, useParams} from "react-router-dom"
import './EditPage.scss'
import {InlineGallery} from "../components/InlineGallery"
import {Map, Placemark, YMaps} from "react-yandex-maps"
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import {Button, Modal, Preloader, RadioGroup, Select, Switch, TextInput} from "react-materialize"
import {Box} from "../components/Skeleton"

export const EditPage = () => {
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
    }
  }

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

  const handleInputChange = (e) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const handleSwitchChange = (e) => {
    console.log(e.target.value)
    const value = e.target.value === 'on' ? 1 : 0
    setData({...data, [e.target.name]: value})
  }

  return (
    <div className="edit">

      <Scrollbars>

        <div className="edit__wrapper">

          <div className="container">

            <div className="edit__controls">

              <div className="edit__back">
                <button
                  className="edit__back-button"
                  onClick={() => history.goBack()}
                >
                  <span><ArrowBack /></span> Назад
                </button>
              </div>

              <div className="details_buttons">

                <Button
                  className="edit__button"
                  node="button"
                  waves="light"
                  disabled={loading}
                  //onClick={handleReportButton}
                >
                  Изменить
                </Button>

                <Button
                  className="modal-trigger red darken-3 edit__button"
                  href="#modal-delete"
                  node="button"
                  waves="light"
                  disabled={loading}
                >
                  Удалить
                </Button>

              </div>

            </div>

            <h1 className="edit__title">
              <TextInput
                id="input-name"
                label="Название"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                disabled={loading}
              />
            </h1>

            <div className="edit__info">

              <div className="edit__block">

                <Select
                  id="select-region"
                  label="Регион:"
                  options={{}}
                  value="1"
                  disabled={loading}
                >
                  <option value="1">
                    Option 1
                  </option>
                  <option value="2">
                    Option 2
                  </option>
                  <option value="3">
                    Option 3
                  </option>
                </Select>

              </div>

              <div className="edit__block">

                <Select
                  id="select-district"
                  label="Район:"
                  options={{}}
                  value="1"
                  disabled={loading}
                >
                  <option value="1">
                    Option 1
                  </option>
                  <option value="2">
                    Option 2
                  </option>
                  <option value="3">
                    Option 3
                  </option>
                </Select>

              </div>

              <div className="edit__block">

                <Select
                  id="select-locality"
                  label="Населенный пункт:"
                  options={{}}
                  value="1"
                  disabled={loading}
                >
                  <option value="1">
                    Option 1
                  </option>
                  <option value="2">
                    Option 2
                  </option>
                  <option value="3">
                    Option 3
                  </option>
                </Select>

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-type"
                  label="Улица:"
                  value={data.street}
                  disabled={loading}
                  onChange={handleInputChange}
                  name="street"
                />

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-type"
                  label="Номер дома:"
                  value={data.number_of_house}
                  disabled={loading}
                  name="number_of_house"
                  onChange={handleInputChange}
                />

              </div>

            </div>

            <div className="edit__map">

              { loading ?
                <div className="edit__preloader">
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
                    className="edit__y-map"
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

            <div className="edit__info">

              <div className="edit__block">
                <Select
                  id="select-organization"
                  label="Организация:"
                  options={{}}
                  value="1"
                  disabled={loading}
                >
                  <option value="1">
                    Option 1
                  </option>
                  <option value="2">
                    Option 2
                  </option>
                  <option value="3">
                    Option 3
                  </option>
                </Select>

              </div>

              <div className="edit__block">

                  <TextInput
                  id="input-type"
                  label="Тип:"
                  value={data.type}
                  disabled={loading}
                  name="type"
                  onChange={handleInputChange}
                  />

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-phone"
                  label="Телефон:"
                  value={data.phone}
                  disabled={loading}
                  name="phone"
                  onChange={handleInputChange}
                />

              </div>

              <div className="edit__block">

                <div className="edit__elem">
                  Аптека:
                </div>

                <Switch
                  id="switch-pharmacy"
                  offLabel="Нет"
                  onLabel="Есть"
                  disabled={loading}
                  //checked={parseInt(data.pharmacy) === 1}
                />

              </div>

              <div className="edit__block">
                <div className="edit__elem">

                  Первая помощь:
                </div>

                <Switch
                  id="switch-primary-health"
                  offLabel="Нет"
                  onLabel="Есть"
                  disabled={loading}
                  //checked={parseInt(data.access_to_primary_health_care) === 1}
                  name="access_to_primary_health_care"
                  onChange={handleSwitchChange}
                />

              </div>

              <div className="edit__block">

                <div className="edit__elem">
                  Экстренная помощь:
                </div>

                <Switch
                  id="switch-emergency-mediical-care"
                  offLabel="Нет"
                  onLabel="Есть"
                  disabled={loading}
                  //checked={parseInt(parseInt(data.availability_of_emergency_mediical_care) === 1}
                />

              </div>

              <div className="edit__block">

                { loading ?
                  <div>
                    <Box width={31}/>
                  </div> :
                  <>
                    <div className="edit__elem">
                      Укомплектованность фельдшерами:
                    </div>

                    {data.staff || 0}
                  </>
                }

              </div>

            </div>

          </div>

          <div className="container">

            <InlineGallery
              className="edit__gallery"
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