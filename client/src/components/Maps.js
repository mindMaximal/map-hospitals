import React, {useContext} from 'react'
import './Maps.scss'
import { YMaps, Map, Clusterer, Placemark } from "react-yandex-maps"
import {MapContext} from "../context/MapContext"
import {Preloader} from "react-materialize";

export const Maps = (props) => {
  const {mapState, setMapState} = useContext(MapContext)

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

  const handlePlacemarkClick = (e, id) => {
    const elActive = props.data.default.find(el => el.active === true)

    if (elActive)
      elActive.active = false

    const el = props.data.default.find(el => el.id === id)
    el.active = true

    setMapState({
      ...mapState,
      zoom: 12,
      'center': [el.latitude, el.longitude]
    })

    props.setSingleView({
      flag: true,
      id: el.id
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
                  minClusterSize: 2,
                  viewportMargin: 128
                }}
              >
                {props.data && props.data.modified.length > 0 ? props.data.modified.map((el, i) => (
                  <Placemark
                    key={i}
                    geometry={[el.latitude, el.longitude]}
                    properties={getPointData(el)}
                    options={getPointOptions(el)}
                    modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                    onClick={e => handlePlacemarkClick(e, el.id)}
                  />
                )) : null}
              </Clusterer>

            </Map>

          </YMaps>
      }

    </div>
  )
}