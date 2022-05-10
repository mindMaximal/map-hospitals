import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {useHistory} from "react-router-dom"
import './EditPage.scss'
import {Map, Placemark, YMaps} from "react-yandex-maps"
import {ReactComponent as ArrowBack} from '../img/arrow-back.svg'
import {Scrollbars} from 'react-custom-scrollbars'
import {Button, Preloader, Switch, TextInput} from "react-materialize"
import {SelectArea} from "../components/SelectArea"

export const AddPage = () => {

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
    latitude: 52.289588,
    longitude: 104.280606,
    medical_facility_id: 0,
    type_id: null,
    phone: '',
    staff: 0,
    pharmacy: 0,
    access_to_primary_health_care: 0,
    availability_of_emergency_mediical_care: 0,
    founding_year: null
  })

  useEffect(() => {
    console.log(error)
    clearError()
  }, [clearError, error])

  const getPointOptions = (el) => {
    return {
      preset: 'islands#violetIcon',
      iconColor: el.active === true ? '#e20101' : '#26a69a'
    }
  }

  const handleSwitchChange = (e) => {
    setData({...data, [e.target.name]: e.target.checked ? 1 : 0})
  }

  const handleSelectChange = (e) => {
    setData({...data, [e.target.name]: parseInt(e.target.value)})
  }

  const handleInputBlur = (e) => {
    setData({...data, [e.target.name]: e.target.value.trim()})
  }

  const handleBackButtonClick = (e) => {
    e.preventDefault()
    history.goBack()
  }

  const handleInputChange = (e) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const fetchAdd= useCallback(async (body) => {
    try {
      return await request(`/api/detail/add`, 'POST', body)
    } catch (e) {}
  }, [request])

  const handleAddButtonClick = () => {
    fetchAdd(data)
      .then((res) => {
        if (res && res.success) {
          history.push(`/edit/${res.id}`)
        } else {
          /*
            ToDo: Обработка ошибки добавления
           */
        }
      })
  }

  const getCoordinates = (e) => {
    setData({
      ...data,
      latitude: e.get("coords")[0],
      longitude: e.get("coords")[1]
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
                  onClick={() => handleAddButtonClick()}
                >
                  Добавить
                </Button>

              </div>

            </div>

            <h1 className="edit__title">
              <TextInput
                id="input-name"
                label="Название:"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={loading}
                required
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
                  value={data.street}
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
                  value={data.number_of_house}
                  disabled={loading}
                  name="number_of_house"
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />

              </div>

              <div className="edit__block">

                <TextInput
                  id="input-type"
                  label="Год основания:"
                  value={data.founding_year}
                  disabled={loading}
                  name="founding_year"
                  type="number"
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
                    onClick={(e) => getCoordinates(e)}

                  >

                    <Placemark
                      geometry={[data.latitude, data.longitude]}
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
                          value={data.latitude}
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
                          value={data.longitude}
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
                  value={data.phone}
                  disabled={loading}
                  name="phone"
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

          {/*<div className="container">

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
*/}
        </div>

      </Scrollbars>

    </div>
  )
}