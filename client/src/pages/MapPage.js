import React, {useCallback, useEffect, useState} from 'react'
import {Sidebar} from "../components/Sidebar";
import {Maps} from "../components/Maps";
import {useHttp} from "../hooks/http.hook";

export const MapPage = () => {
  return (
    <div className="container--map">
      <Sidebar />
      <Maps />
    </div>
  )
}