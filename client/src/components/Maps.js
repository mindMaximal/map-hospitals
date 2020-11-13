import React from 'react'
import './Maps.scss'
import {Map, YMaps} from "react-yandex-maps"

export const Maps = () => {

  const mapData = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };

  const coordinates = [
    [55.684758, 37.738521],
    [57.684758, 39.738521]
  ]

  return (
    <div className="maps">
      <YMaps>
        <Map
          defaultState={{ center: [52.278534, 104.299353], zoom: 13 }}
          className="y-map"
        />
      </YMaps>
    </div>
  )
}