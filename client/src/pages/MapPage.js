import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar"
import {Maps} from "../components/Maps"
import {useHttp} from "../hooks/http.hook"
import {MapContext} from "../context/MapContext"
import {Reports} from "../components/Reports";

export const MapPage = () => {

  const {loading, error, request, clearError} = useHttp()
  const [data, setData] = useState([])
  const [dataModified, setDataModified] = useState([])

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/map', 'POST')
      setData(fetched.data)
      setDataModified(fetched.data)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    console.log('Loading')
  }

  const updateData = (value) => {
    setDataModified(value)
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

        <Sidebar loading={loading} data={data} dataModified={dataModified} updateData={updateData}/>

        <Maps data={dataModified}/>

        <Reports />

      </MapContext.Provider>
    </div>
  )
}