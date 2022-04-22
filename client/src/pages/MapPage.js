import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar"
import {Maps} from "../components/Maps"
import {useHttp} from "../hooks/http.hook"
import {MapContext} from "../context/MapContext"
import {Reports} from "../components/Reports"

export const MapPage = () => {

  const {loading, error, request, clearError} = useHttp()
  const [objects, setObjects] = useState({
    data: {
      default: [],
      modified: []
    }
  })
  const [orgs, setOrgs] = useState([])
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

      setObjects({
        ...objects,
        'data': {
          default: fetched.data,
          modified: fetched.data
        }
      })

      const fetchedOrgs = await request('/api/map/organizations', 'POST')
      console.log('orgs', fetchedOrgs)
      setOrgs(fetchedOrgs.data)

    } catch (e) {}
  }, [request])


  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateData = (value, force = false) => {
    setObjects({...objects,
      'data': {
        default: force ? value : objects.data.default,
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
          data={objects.data}
          updateData={updateData}
          singleView={singleView}
          setSingleView={setSingleView}
        />

        <Maps
          loading={loading}
          data={objects.data}
          orgs={orgs}
          updateData={updateData}
          setSingleView={setSingleView}
        />

        <Reports />

      </MapContext.Provider>
    </div>
  )
}