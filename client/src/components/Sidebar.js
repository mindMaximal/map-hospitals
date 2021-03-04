import React, {useContext, useEffect, useState} from 'react'
import {ListView} from './ListView'
import './Sidebar.scss'
import {MapContext} from "../context/MapContext"
import {SingleView} from "./SingleView"
import {Search} from "./Search"

export const Sidebar = (props) => {
  let myRef = React.createRef()

  const [state, setState] = useState({
    scroll: false,
    search: null,
    singleView: false,
    filter: {
      show: false
    }
  })

  const {mapState, setMapState} = useContext(MapContext)

  const searchViewClick = (e, id) => {
    let el = props.data.default.find(el => el.id === id)
    el.active = true

    props.updateData([el])
    setMapState({...mapState, 'center': el.geo.split(', ')})
    setState({...state, 'singleView': true})
  }

  const handleFilterButton = (e) => {
    setState({...state, 'filter': {
        ...state.filter,
        show: !state.filter.show
      }})
  }

  const HandleInputSearch = (e) => {
    setState({...state, 'search': e.target.value.trim().toLowerCase()})
  }

  const handlePanelScroll = (e) => {
    const scrollTop = myRef.current.scrollTop

    if (scrollTop > 50) {
      setState({...state, 'scroll': true})
    } else {
      setState({...state, 'scroll': false})
    }

    const scrollbarSlider = document.querySelector('.scrollbar__slider')
    const scrollTargetHeight = document.querySelector('.sidebar__panel').scrollHeight

    let scrollToTop = scrollTop / scrollTargetHeight * 100

    console.log(scrollToTop)

    scrollbarSlider.style.top = scrollToTop + 'px'
  }

  const handleBack = () => {
    setState({...state, 'singleView': false})
    props.updateData(props.data.default)
  }

  useEffect(() => {
    props.updateData(props.data.default.filter((obj) => {
      return obj.name.toLowerCase().indexOf(state.search) !== -1;
    }))
  }, [state.search])

  return (
    <div className="sidebar">

      <div className="sidebar__wrapper">

        <Search filterShow={state.filter.show} scroll={state.scroll} handleInput={HandleInputSearch} handleFilter={handleFilterButton}/>

        <div
          className="sidebar__panel"
          ref={myRef}
          onScroll={handlePanelScroll}
        >
          {!props.loading && state.singleView ? <SingleView elem={props.data.modified[0]} back={handleBack}/> : <ListView loading={props.loading} list={props.data.modified} searchViewClick={searchViewClick}/>
          }

          <div className="scrollbar sidebar__scrollbar">
            <div className="scrollbar__slider"></div>
          </div>
        </div>

      </div>

    </div>
  )
}