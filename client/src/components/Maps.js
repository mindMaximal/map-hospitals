import React from 'react'
import './Maps.scss'
import { YMaps, Map, Clusterer, Placemark } from "react-yandex-maps"

export const Maps = (props) => {

  const mapState = {
    center: [55.751574, 37.573856],
    zoom: 9,
    behaviors: ["default", "scrollZoom"],

  };

  const points = [
    [55.721574, 37.334856],
    [55.731574, 37.573856]
  ]

  const getPointData = () => {
    return {
      balloonContentBody: "placemark <strong>balloon " +  "</strong>",
      clusterCaption: "placemark <strong>" + "</strong>"
    };
  };

  const getPointOptions = () => {
    return {
      preset: "islands#violetIcon"
    };
  };

  return (
    <YMaps>
      <Map
        state={mapState}
        className="y-map"
      >
        <Clusterer
          options={{
            preset: "islands#invertedVioletClusterIcons",
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
          }}
        >
          {points.map((coordinates, i) => (
            <Placemark
              key={i}
              geometry={coordinates}
              properties={getPointData()}
              options={getPointOptions()}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            />
          ))}
        </Clusterer>
      </Map>
    </YMaps>
  )
}