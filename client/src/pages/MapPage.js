import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar"
import {Maps} from "../components/Maps"
import {useHttp} from "../hooks/http.hook"
import {MapContext} from "../context/MapContext"
import {Reports} from "../components/Reports";
import {Loader} from "../components/Loader";
import {useMap} from "../hooks/map.hook";


/*
*   ToDo:
*    - Отчеты
*    - Поиск по фильтрам
*    - Пофиксить пропадание при увелечении
*    - scrollbar
*
*  */

export const MapPage = () => {

  const {loading, error, request, clearError} = useHttp()
  const {setDataState, dataState} = useMap()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/map', 'POST')

      console.log('Данные получены')
      //Delete
     fetched.data.map((el, i) => {
        el.id = i
        el.active = false
        el.pharmacy = Math.random() < 0.5
        el.firstAid = Math.random() < 0.5
        el.emergencyAssistance = Math.random() < 0.5
        el.staff = Math.floor((Math.random() * 10) + 1);
      })

      setDataState({
        ...dataState,
        'data': {
          default: fetched.data,
          modified: fetched.data
      }})

      console.log(dataState)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const [mapState, setMapState] = useState({
    center: [52.287054, 104.281047],
    zoom: 9,
    behaviors: ["default", "scrollZoom"],
    controls: [],
  });

  if (loading) {
    return <Loader />
  }

  return (
    <div className="container--map">
      <MapContext.Provider value={{
        mapState, setMapState
      }}>

        {
          !loading &&
            <Sidebar
              loading={loading}
            />
        }

        {
          /*!loading &&
            <Maps
              loading={loading}
            />*/
        }

        <Reports />

      </MapContext.Provider>
    </div>
  )
}