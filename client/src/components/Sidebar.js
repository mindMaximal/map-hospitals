import React, {useContext} from 'react'
import {ListView} from './ListView'
import magnifer from '../img/magnifier.svg'
import {ReactComponent as Filter} from '../img/filter.svg'
import './Sidebar.scss'
import {MapContext} from "../context/MapContext";

export const Sidebar = (props) => {

  const {mapState, setMapState} = useContext(MapContext)

  const searchViewClick = (e) => {
    console.log(mapState)
    //setMapState({...mapState, ["zoom"]: 5})
  }

  return (
    <div className="sidebar">

      <div className="sidebar__wrapper">

        <div className="sidebar__header shadow">

          <div className="sidebar__search">

            <input
              type="text"
              placeholder="Поиск"
              className="sidebar__input"
            />

            <button
              className="sidebar__button sidebar__button--search"
            >
              <img src={magnifer} alt="Поиск"/>
            </button>

          </div>

          <div className="sidebar__filter">
            <button className="sidebar__button--filter">
              <Filter />
            </button>
          </div>

        </div>

        <div className="sidebar__panel">
          {!props.loading && <ListView list={props.data} searchViewClick={searchViewClick}/>}
        </div>

      </div>

    </div>
  )
}