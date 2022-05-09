import React, {useContext} from 'react'
import './Maps.scss'
import { YMaps, Map, Clusterer, Placemark } from "react-yandex-maps"
import {MapContext} from "../context/MapContext"
import {Preloader} from "react-materialize";

export const Maps = (props) => {
  const {mapState, setMapState} = useContext(MapContext)

  const getPointOptions = (el) => {
    let color

    if (el.active) {
      color = '#0d47a1'
    } else {
      if (el.staffing === 1) {
          color = '#26a69a'
      } else if (el.staffing < 1 && el.staffing >= 0.5) {
        color = '#9ed3e7';
      }else if (el.staffing < 0.5 && el.staffing > 0) {
        color = '#fdc84d'
      } else if (el.staffing === 0) {
        color = '#e20101'
      } else {
        color = '#E6E6FA'
      }
    }

    return {
      preset: 'islands#violetIcon',
      iconColor: color
    };
  };

  const getPointOptionsOrgs = () => {
    return {
      preset: 'islands#blueMedicalIcon',
      iconColor: '#e7d1ab'
    }
  }

  const handlePlacemarkClick = (e, element) => {
    let objects
    //Проверяем организация или ФАП
    if (element.type_id === 3) {
      objects = props.orgs
    } else {
      objects = props.data.default
    }

    const elActive = objects.find(el => el.active === true)

    if (elActive)
      elActive.active = false

    element.active = true

    setMapState({
      ...mapState,
      zoom: 12,
      'center': [element.latitude, element.longitude]
    })

    props.setSingleView({
      flag: true,
      id: element.id,
      typeId: element.type_id
    })
  }

  return (
    <div className="map">
      {
        props.loading ?
          <div className="map__preloader">
            <Preloader
              active
              color="blue"
              flashing={false}
              size="small"
            />
          </div> :
          <YMaps>
            <Map
              state={mapState}
              className="y-map"
              instanceRef={mapState}
            >
              <Clusterer
                options={{
                  preset: 'islands#darkGreenClusterIcons',
                  groupByCoordinates: false,
                  clusterDisableClickZoom: false,
                  clusterHideIconOnBalloonOpen: true,
                  geoObjectHideIconOnBalloonOpen: true,
                  iconColor: '#26a69a',
                  minClusterSize: props.data.modified.length > 50 ? 3 : 10,
                  viewportMargin: props.data.modified.length > 50 ? 128 : 12000,
                  maxZoom: 9
                }}
              >
                {props.data && props.data.modified.length > 0 ? props.data.modified.map((el, i) => (
                  <Placemark
                    key={i}
                    geometry={[el.latitude, el.longitude]}
                    options={getPointOptions(el)}
                    modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                    onClick={e => handlePlacemarkClick(e, el)}
                  />
                )) : null}
              </Clusterer>

              {props.orgs && props.orgs.length > 0 ? props.orgs.map((el, i) => (
                <Placemark
                  key={i}
                  geometry={[el.latitude, el.longitude]}
                  options={getPointOptionsOrgs()}
                  modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                  onClick={e => handlePlacemarkClick(e, el)}
                />
              )) : null}

            </Map>

          </YMaps>
      }

    </div>
  )
}