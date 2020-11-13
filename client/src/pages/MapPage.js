import React from 'react'
import {Sidebar} from "../components/Sidebar";
import {Maps} from "../components/Maps";

export const MapPage = () => {
  return (
    <div className="container--map">
      <Sidebar />
      <Maps />
    </div>
  )
}