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

  const handleApiAvailable = ymaps => {

    console.log(ymaps)
    this.ymaps = ymaps;
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
      preset: "islands#violetIcon"
    };
  };

  return (
    <div className="map">

      <YMaps
        onApiAvaliable={maps => handleApiAvailable(maps)}
      >
        <Map
          state={map.mapState}
          className="y-map"
          instanceRef={map}
          //onLoad={ymaps => (map = ymaps)}
        >
          <Clusterer
            options={{
              preset: "islands#invertedVioletClusterIcons",
              groupByCoordinates: false,
              clusterDisableClickZoom: false,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            }}
          >
            {props.data.map((obj, i) => (
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