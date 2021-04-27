import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar"
import {Maps} from "../components/Maps"
import {useHttp} from "../hooks/http.hook"
import {MapContext} from "../context/MapContext"
import {Reports} from "../components/Reports"


/*
*   ToDo:
*    - Отчеты
*    - Поиск по фильтрам
*    - Пофиксить пропадание при увелечении
*    - scrollbar
*
*   https://geoportal.egisz.rosminzdrav.ru/
*
*  */

export const MapPage = () => {

  const {loading, error, request, clearError} = useHttp()
  const [state, setState] = useState({
    data: {
      default: [],
      modified: []
    }
  })
  const [singleView, setSingleView] = useState({
    flag: false,
    id: null
  })

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/map', 'POST')

      console.log('fetched', fetched)

      setState({
        ...state,
        'data': {
          default: fetched.data,
          modified: fetched.data
        }
      })

    } catch (e) {}
  }, [request])


  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateData = (value, force = false) => {
    setState({...state,
      'data': {
        default: force ? value : state.data.default,
        modified: value
      }})
  }

  const [mapState, setMapState] = useState({
    center: [52.287054, 104.281047],
    zoom: 9,
    behaviors: ["default", "scrollZoom"],
    controls: [],
  });

  return (
    <div className="container--map">
      <MapContext.Provider value={{
        mapState, setMapState
      }}>

        <Sidebar
          loading={loading}
          data={state.data}
          updateData={updateData}
          singleView={singleView}
          setSingleView={setSingleView}
        />

        <Maps
          loading={loading}
          data={state.data}
          updateData={updateData}
          setSingleView={setSingleView}
        />

        <Reports />

      </MapContext.Provider>
    </div>
  )
}