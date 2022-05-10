import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {useHistory, useParams} from "react-router-dom"
import './EditPage.scss'
import {InlineGallery} from "../components/InlineGallery"
import {Map, Placemark, YMaps} from "react-yandex-maps"
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import { Scrollbars } from 'react-custom-scrollbars'
import {Button, Modal, Preloader, Switch, TextInput} from "react-materialize"
import {SelectArea} from "../components/SelectArea"
import {InlineRates} from "../components/InlineRates";

export const EditPage = () => {
  const {loading, error, request, clearError} = useHttp()

  const history = useHistory()

  const [data, setData] = useState({
    id: null,
    name: '',
    region_id: 0,
    district_id: 0,
    locality_id: 0,
    street: '',
    number_of_house: '',
    latitude: 0,
    longitude: 0,
    medical_facility_id: 0,
    type_id: null,
    phone: '',
    staff: 0,
    pharmacy: 0,
    access_to_primary_health_care: 0,
    availability_of_emergency_mediical_care: 0,
    founding_year: ''
  })
  const [deletedData, setDeletedData] = useState(false)
  const [changed, setChanged] = useState(false)

  let { id } = useParams()

  useEffect(() => {
    console.log(error)
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request(`/api/detail/${id}`, 'GET', null)

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
    }
  }

  const fetchDelete = useCallback(async (body) => {
    try {
      await request(`/api/detail/delete`, 'POST', body)

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
    if (!changed)
      setChanged(true)

    setData({...data, [e.target.name]: e.target.value})
  }

  const handleSwitchChange = (e) => {
    if (!changed)
      setChanged(true)

    setData({...data, [e.target.name]: e.target.checked ? 1 : 0})
  }

  const handleSelectChange = (e) => {
    if (!changed)
      setChanged(true)

    setData({...data, [e.target.name]: parseInt(e.target.value)})
  }

  const handleInputBlur = (e) => {
    setData({...data, [e.target.name]: e.target.value.trim()})
  }

  const handleBackButtonClick = (e) => {
    if (!changed) {
      e.preventDefault()
      history.goBack()
    }
  }

  const fetchUpdate = useCallback(async (body) => {
    try {
      const fetched = await request(`/api/detail/update`, 'POST', body)

      return fetched.success
    } catch (e) {}
  }, [request])

  const handleSaveButtonClick = (relocate = false) => {
    fetchUpdate(data)
      .then((success) => {
        if (success && relocate) {
          history.goBack()
        }
      })
  }

  return (
    <div className="edit">

      <Scrollbars>

        <div className="edit__wrapper">

          <div className="container">

            <div className="edit__controls">

              <div className="edit__back">
                <button
                  className="edit__back-button modal-trigger"
                  href="#modal-update"
                  onClick={handleBackButtonClick}
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
                  onClick={() => handleSaveButtonClick()}
                >
                  Сохранить
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
                label="Название:"
                name="name"
                value={(data.name || '').toString()}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={loading}
              />
            </h1>

            <div className="edit__info">

              {/*<div className="edit__block">

                <SelectArea
                  name="region_id"
                  onChange={handleSelectChange}
                  disabled={true}
                  value={data.region_id}
                  label="Регион"
                  query="region"
                />

              </div>

              <div className="edit__block">

                <SelectArea
                  name="district_id"
                  onChange={handleSelectChange}
                  disabled={true}
                  value={data.district_id}
                  label="Район"
                  query="district"
                />

              </div>*/}

              <div className="edit__block">

                <SelectArea
                  name="locality_id"
                  onChange={handleSelectChange}
                  disabled={loading}
                  value={data.locality_id}
                  label="Населенный пункт"
                  query="locality"
                />

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-type"
                  label="Улица:"
                  value={(data.street || '').toString()}
                  disabled={loading}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  name="street"
                />

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-type"
                  label="Номер дома:"
                  value={(data.number_of_house || '').toString()}
                  disabled={loading}
                  name="number_of_house"
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />

              </div>

              <div className="edit__block">

                <SelectArea
                  name="medical_facility_id"
                  onChange={handleSelectChange}
                  disabled={loading}
                  value={data.medical_facility_id}
                  label="Организация"
                  query="facility"
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

                  <div className="edit__coordinates">

                    <div>

                      <div className="edit__coordinate">

                        <TextInput
                          id="input-type"
                          label="Широта:"
                          value={(data.latitude || '').toString()}
                          disabled={loading}
                          name="latitude"
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                        />

                      </div>

                      <div className="edit__coordinate">

                        <TextInput
                          id="input-type"
                          label="Долгота:"
                          value={(data.longitude || '').toString()}
                          disabled={loading}
                          name="longitude"
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                        />

                      </div>

                    </div>

                  </div>

                </YMaps>

              }

            </div>

            <div className="edit__info">

              <div className="edit__block">

                <SelectArea
                  name="type_id"
                  onChange={handleSelectChange}
                  disabled={loading}
                  value={data.type_id}
                  label="Тип"
                  query="type"
                />

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-phone"
                  label="Телефон:"
                  value={(data.phone || '').toString()}
                  disabled={loading}
                  name="phone"
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />

              </div>

              <div className="edit__block">

              <TextInput
                id="input-founding-year"
                label="Год основания:"
                value={(data.founding_year || '').toString()}
                disabled={loading}
                name="founding_year"
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />

            </div>

              <div className="edit__block edit__block--small">

                <div className="edit__elem">
                  Аптека:
                </div>

                <Switch
                  id="switch-pharmacy"
                  offLabel="Нет"
                  onLabel="Есть"
                  disabled={loading}
                  checked={parseInt(data.pharmacy) === 1}
                  name="pharmacy"
                  onChange={handleSwitchChange}
                />

              </div>

              <div className="edit__block edit__block--small">
                <div className="edit__elem">

                  Первая помощь:
                </div>

                <Switch
                  id="switch-primary-health"
                  offLabel="Нет"
                  onLabel="Есть"
                  disabled={loading}
                  checked={parseInt(data.access_to_primary_health_care) === 1}
                  name="access_to_primary_health_care"
                  onChange={handleSwitchChange}
                />

              </div>

              <div className="edit__block edit__block--small">

                <div className="edit__elem">
                  Экстренная помощь:
                </div>

                <Switch
                  id="switch-emergency-mediical-care"
                  offLabel="Нет"
                  onLabel="Есть"
                  disabled={loading}
                  checked={parseInt(data.availability_of_emergency_mediical_care) === 1}
                  name="availability_of_emergency_mediical_care"
                  onChange={handleSwitchChange}
                />

              </div>

            </div>

          </div>

          <div className="container">

            <InlineGallery
              className="edit__gallery"
              loading={loading}
              id={id}
              edit={true}
            />

          </div>

          <div className="container">

            <InlineRates
              className="detail__rates"
              loading={loading}
              id={id}
              mode="edit"
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

      <Modal
        actions={[
          <Button
            className="modal-trigger red darken-3"
            node="button"
            waves="light"
            style={{
              marginRight: '5px'
            }}
            disabled={loading}
            onClick={async () => { history.goBack()}}
          >
            Да
          </Button>,
          <Button
            modal="close"
            node="button"
            waves="green"
            disabled={loading}
            style={{
              marginRight: '5px'
            }}
          >
            Нет
          </Button>,
          <Button
            node="button"
            waves="green"
            disabled={loading}
            onClick={() => handleSaveButtonClick(true)}
          >
            Сохранить и выйти
          </Button>
        ]}
        bottomSheet={false}
        fixedFooter={false}
        header="Вы хотите выйти, не сохранив изменения?"
        id="modal-update"
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
          Измененные данные не будут сохранены!
        </div>
      </Modal>

    </div>
  )
}