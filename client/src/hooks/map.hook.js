import {MapContext} from "../context/MapContext";
import {useContext, useEffect, useState} from "react";

export const useMap = () => {
  const {mapState, setMapState} = useContext(MapContext)
  const [state, setState] = useState({
    data: {
      default: [],
      modified: []
    },
    singleView: false
  })

  const updateData = (value) => {
    setState({...state, 'data': {
        default: state.data.default,
        modified: value
      }})
  }

  const searchViewClick = (e, id) => {
    let el = state.data.default.find(el => el.id === id)
    el.active = true
    console.log('SearchView', el)

    setMapState({
      ...mapState,
      'center': el.geo.split(', ')
    })

    setState({
      ...state,
      'singleView': true,
      'data': {
        default: state.data.default,
        modified: [el]
      }
    })
  }


  useEffect(() => {
    console.log(state)
  }, [state])

  const setData = (data) => {
    setState({
      ...state,
      'data': data
    })
  }

  const getData = () => {
    return state.data
  }

  const singleView = () => {
    return state.singleView
  }

  return {updateData, searchViewClick, setData, getData, singleView}
}