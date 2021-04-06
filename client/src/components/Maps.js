import React, {useContext} from 'react'
import './Maps.scss'
import { YMaps, Map, Clusterer, Placemark, Button } from "react-yandex-maps"
import {MapContext} from "../context/MapContext";

export const Maps = (props) => {
  const {mapState, setMapState} = useContext(MapContext)

  function createZoomControlLayout(ymaps) {
    // Функция по созданию layout'a целиком взята из песочницы яндекс карт
    // https://tech.yandex.com/maps/jsbox/2.1/zoom_layout
    const ZoomLayout = ymaps.templateLayoutFactory.createClass("<div id='zoom-in' class='btn'><i class='icon-plus'>1</i></div><br>")

    return ZoomLayout
  }

  const handleApiAvailable = ymaps => {
    console.log(ymaps)
    const layout = createZoomControlLayout(ymaps)
    this.setState({ layout })
  };

  const getPointData = (el) => {
    return {
      clusterCaption: "placemark <strong>" + "</strong>"
    };
  };

  const getPointOptions = () => {
    return {
      preset: 'islands#violetIcon',
      iconColor: '#26a69a'
    };
  };

  const handlePlacemarkClick = (e, obj) => {
    let el = props.data.default.find(el => el.id === obj.id)
    el.active = true

    props.updateData([el])
    props.setSingleView(true)
    setMapState({...mapState, 'center': el.geo.split(', ')})
  }

  return (
    <div className="map">

      <YMaps
        onApiAvaliable={ymaps => handleApiAvailable(ymaps)}
      >
        <Map
          state={mapState}
          className="y-map"
          instanceRef={mapState}
          //onLoad={ymaps => (map = ymaps)}
        >
          <Clusterer
            options={{
              preset: 'islands#darkGreenClusterIcons',
              groupByCoordinates: false,
              clusterDisableClickZoom: false,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false,
              iconColor: '#26a69a'
            }}
          >
            {props.data && props.data.modified.length > 0 ? props.data.modified.map((obj, i) => (
              <Placemark
                key={i}
                geometry={obj.geo.split(', ')}
                properties={getPointData(obj)}
                options={getPointOptions()}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                onClick={e => handlePlacemarkClick(e, obj)}
              />
            )) : null}
          </Clusterer>

        </Map>

      </YMaps>

    </div>
  )
}