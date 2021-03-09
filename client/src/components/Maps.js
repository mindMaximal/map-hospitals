import React, {useContext, useEffect, useState} from 'react'
import './Maps.scss'
import { YMaps, Map, Clusterer, Placemark, Button } from "react-yandex-maps"
import {AuthContext} from "../context/AuthContext";
import {MapContext} from "../context/MapContext";
import {useMap} from "../hooks/map.hook";

export const Maps = (props) => {
  const {mapState} = useContext(MapContext)
  const {updateData, getData} = useMap()

  const getPointData = (el) => {

    return {
      balloonContentBody: `
        <div style='background: #ffffff'><b>Название: </b>${el.name}</div>
        <div><b>Организация:</b> ${el.parent}</div>
      `,
      clusterCaption: "placemark <strong>" + "</strong>"
    }
  }

  const getPointOptions = () => {
    return {
      preset: 'islands#violetIcon',
      iconColor: '#26a69a'
    }
  }

  return (
    <div className="map">

      <YMaps>
        <Map
          state={mapState}
          className="y-map"
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
            {getData().modified.map((obj, i) => (
              <Placemark
                key={i}
                geometry={obj.geo.split(', ')}
                properties={getPointData(obj)}
                options={getPointOptions()}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                //onClick={singleViewClick(id)}
              />
            ))}
          </Clusterer>

        </Map>

      </YMaps>

    </div>
  )
}