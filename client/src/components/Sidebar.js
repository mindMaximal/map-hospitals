import React, {useContext, useEffect, useState} from 'react'
import {ListView} from './ListView'
import magnifer from '../img/magnifier.svg'
import {ReactComponent as Filter} from '../img/filter.svg'
import './Sidebar.scss'
import {MapContext} from "../context/MapContext";
import {SearchFilter} from "./SearchFilter";
import {CardPanel, TextInput} from "react-materialize";

export const Sidebar = (props) => {
  let myRef = React.createRef()

  const [scroll, setScroll] = useState(false)

  const [filterState, setFilterState] = useState({
    show: false
  })

  const [search, setSearch] = useState({
    value: null
  })

  const {mapState, setMapState} = useContext(MapContext)

  const searchViewClick = (e) => {
    console.log(mapState)
    //setMapState({...mapState, ["zoom"]: 5})
  }

  const handleFilterButton = (e) => {
    console.log(filterState.show)
    console.log(e)
    setFilterState({...filterState, 'show': !filterState.show})
  }

  const HandleInputSearch = (e) => {
    setSearch({...search, 'value': e.target.value.trim().toLowerCase()})
  }

  const handlePanelScroll = (e) => {
    const scrollTop = myRef.current.scrollTop

    if (scrollTop > 50) {
      setScroll(true)
    } else {
      setScroll(false)
    }
  }

  useEffect(() => {
    props.updateData(props.data.filter((obj) => {

      if (obj.name.toLowerCase().indexOf(search.value) !== -1)
        console.log('Name: ' + obj.name.toLowerCase() + ' str: ' + search.value)

      return obj.name.toLowerCase().indexOf(search.value) !== -1;
    }))
  }, [search])

  return (
    <div className="sidebar">

      <div className="sidebar__wrapper">

        <CardPanel className={ scroll ? "sidebar__header" : "sidebar__header sidebar__header--fixed"}>

          <div className="sidebar__search">

            <TextInput
              id="sidebar-input"
              inputClassName="sidebar__text-input"
              placeholder="Поиск"
              xl
              onChange={HandleInputSearch}
            />

          </div>

          <div className="sidebar__controls">

            <button
              className="sidebar__button sidebar__button--search"
            >
              <img src={magnifer} alt="Поиск"/>
            </button>

            <button
              className="sidebar__button sidebar__button--filter"
              onClick={handleFilterButton}
            >
              <Filter />
            </button>
          </div>

          { filterState.show ?
            <SearchFilter />
            : null
          }

        </CardPanel>

        <div
          className="sidebar__panel"
          ref={myRef}
          onScroll={handlePanelScroll}
        >
          {!props.loading && <ListView list={props.dataModified} searchViewClick={searchViewClick}/>}
        </div>

      </div>

    </div>
  )
}