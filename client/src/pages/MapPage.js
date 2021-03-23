import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar"
import {Maps} from "../components/Maps"
import {useHttp} from "../hooks/http.hook"
import {MapContext} from "../context/MapContext"
import {Reports} from "../components/Reports";
import {Loader} from "../components/Loader";


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
  const [state, setState] = useState({
    data: {
      default: [],
      modified: []
    }
  })
  const [singleView, setSingleView] = useState(false)

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/map', 'POST')

      //Delete
     fetched.data.map((el, i) => {
        el.id = i
        el.active = false
        el.pharmacy = Math.random() < 0.5
        el.firstAid = Math.random() < 0.5
        el.emergencyAssistance = Math.random() < 0.5
        el.staff = Math.floor((Math.random() * 10) + 1);
      })

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

  const updateData = (value) => {
    setState({...state,
      'data': {
        default: state.data.default,
        modified: value
      }})
  }

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
            data={state.data}
            updateData={updateData}
            singleView={singleView}
            setSingleView={setSingleView}
          />
        }

        {
          !loading &&
          <Maps
            loading={loading}
            data={state.data}
            updateData={updateData}
            setSingleView={setSingleView}
          />
        }

        <Reports />

      </MapContext.Provider>
    </div>
  )
}