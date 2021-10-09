import {createContext} from 'react'

function noop() {}

export const MapContext = createContext({
  mapState: null,
  zoom: 9,
  setMapState: noop
})