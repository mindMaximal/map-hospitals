import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar"
import {Maps} from "../components/Maps"
import {useHttp} from "../hooks/http.hook"
import {MapContext} from "../context/MapContext"
import {Navigation} from "../components/Navigation"

export const MapPage = () => {

  const {loading, error, request, clearError} = useHttp()
  const [objects, setObjects] = useState({
    data: {
      default: [],
      modified: []
    }
  })
  const [hiddenSidebar, setHiddenSidebar] = useState(false)
  const [hiddenNavigation, setHiddenNavigation] = useState(true)
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
          modified: fetched.data,
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
    <div className="map-page container--map">
      <MapContext.Provider value={{
        mapState, setMapState
      }}>

        <Sidebar
          loading={loading}
          data={objects.data}
          orgs={orgs}
          updateData={updateData}
          singleView={singleView}
          setSingleView={setSingleView}
          hiddenSidebar={hiddenSidebar}
          setHiddenSidebar={setHiddenSidebar}
          setHiddenNavigation={setHiddenNavigation}
        />

        <Maps
          loading={loading}
          data={objects.data}
          orgs={orgs}
          updateData={updateData}
          setSingleView={setSingleView}
          setHiddenSidebar={setHiddenSidebar}
        />

        <Navigation
          setHiddenSidebar={setHiddenSidebar}
          hiddenNavigation={hiddenNavigation}
          setHiddenNavigation={setHiddenNavigation}
        />

      </MapContext.Provider>
    </div>
  )
}