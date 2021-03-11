import {MapContext} from "../context/MapContext";
import {useContext, useEffect, useState} from "react";

export const useMap = () => {
  const {mapState, setMapState} = useContext(MapContext)
  const [dataState, setDataState] = useState({
    data: {
      default: [],
      modified: []
    },
    singleView: false
  })

  const data = useCallback()

  const updateData = (value) => {
    setDataState({...dataState, 'data': {
        default: dataState.data.default,
        modified: value
      }})
  }

  useEffect(() => {
    console.log(dataState)
  }, [dataState])

  const searchViewClick = (e, id) => {
    let el = dataState.data.default.find(el => el.id === id)
    el.active = true

    //console.log('SearchView', el)

    setMapState({
      ...mapState,
      'center': el.geo.split(', ')
    })

    setDataState({
      ...dataState,
      'singleView': true,
      'data': {
        default: dataState.data.default,
        modified: [el]
      }
    })
  }


/*  const setData = (data) => {
    console.log('Попытка устанвоить data:', data)
    setData({
      ...data,
      'data': data
    })

    console.log('setData',{
      ...data,
      'data': data
    })

  }*/

  /*const getData = () => {
    console.log('GetData',dataState)
    return dataState.data
  }*/

  const singleView = () => {
    return dataState.singleView
  }

  return {updateData, searchViewClick, setDataState,  singleView, dataState}
}