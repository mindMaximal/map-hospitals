import {createContext} from 'react'

function noop() {}

export const MapContext = createContext({
  mapState: null,
  setMapState: noop
})