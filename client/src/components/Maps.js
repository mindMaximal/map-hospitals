import React, {useContext, useEffect, useState} from 'react'
import './Maps.scss'
import { YMaps, Map, Clusterer, Placemark, Button } from "react-yandex-maps"
import {AuthContext} from "../context/AuthContext";
import {MapContext} from "../context/MapContext";

export const Maps = (props) => {
  const map = useContext(MapContext)

  /*useEffect(() => {
  const map = React.useRef(null);
    if (map.current) {
      map.current.setZoom(9, { duration: 300 });
      console.log(map)
    }
  }, [zoom]);*/

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
      balloonContentBody: `
        <div style='background: #ffffff'><b>Название: </b>${el.name}</div>
        <div><b>Организация:</b> ${el.parent}</div>
      `,
      clusterCaption: "placemark <strong>" + "</strong>"
    };
  };

  const getPointOptions = () => {
    return {
      preset: 'islands#violetIcon',
      iconColor: '#26a69a'
    };
  };

  return (
    <div className="map">

      <YMaps
        onApiAvaliable={ymaps => handleApiAvailable(ymaps)}
      >
        <Map
          state={map.mapState}
          className="y-map"
          instanceRef={map}
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
            {props.data.modified.map((obj, i) => (
              <Placemark
                key={i}
                geometry={obj.geo.split(', ')}
                properties={getPointData(obj)}
                options={getPointOptions()}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              />
            ))}
          </Clusterer>

        </Map>

      </YMaps>

    </div>
  )
}