import React, {useContext, useEffect, useState} from 'react'
import {ListView} from './ListView'
import './Sidebar.scss'
import {MapContext} from "../context/MapContext"
import {SingleView} from "./SingleView"
import {Search} from "./Search"
import {Scrollbar} from "./Scrollbar"
import {Preloader} from "react-materialize";

export const Sidebar = (props) => {
  let panelScrollRef = React.createRef()

  const [state, setState] = useState({
    scroll: false,
    search: null,
    filter: {
      show: false
    }
  })

  const {mapState, setMapState} = useContext(MapContext)

  const searchViewClick = (e, id) => {
    const elActive = props.data.default.find(el => el.active === true)

    if (elActive)
      elActive.active = false

    const el = props.data.default.find(el => el.id_Med_punkt === id)
    el.active = true

    setMapState({
      ...mapState,
      zoom: 12,
      'center': [el.latitude, el.longitude]}
    )

    props.setSingleView({
      flag: true,
      id: el.id_Med_punkt
    })
  }

  const handleFilterButton = () => {
    setState({...state, 'filter': {
        ...state.filter,
        show: !state.filter.show
      }})
  }

  const HandleInputSearch = (e) => {
    setState({...state, 'search': e.target.value.trim().toLowerCase()})
  }

  const scrollInit = (elem, scrollbar) => {
    const scrollHeight = elem.scrollHeight
    const viewHeight = elem.offsetHeight

    let scrollbarSliderHeight = viewHeight * viewHeight / scrollHeight

    if (scrollbarSliderHeight === scrollHeight) {
      scrollbar.style.display = 'none'
    } else {
      scrollbar.style.display = 'block'
    }

    scrollbar.querySelector('.scrollbar__slider').style.height = scrollbarSliderHeight + 'px';
  }

  const handlePanelScroll = () => {
    const scrollTop = panelScrollRef.current.scrollTop

    if (scrollTop > 50) {
      setState({...state, 'scroll': true})
    } else {
      setState({...state, 'scroll': false})
    }

    const scrollbar = document.querySelector('.scrollbar');
    const scrollbarSlider = scrollbar.querySelector('.scrollbar__slider')
    const scrollPanel = document.querySelector('.sidebar__panel');

    let scrollToTop = scrollPanel.scrollTop / scrollPanel.scrollHeight

    scrollbarSlider.style.top = scrollToTop * scrollPanel.offsetHeight + 'px'
  }

  useEffect(() => {
    const scrollElem = document.querySelector('.sidebar__panel')
    const scrollbar = document.querySelector('.scrollbar')

    scrollInit(scrollElem, scrollbar)
  }, [props.singleView, props.data])

  window.addEventListener(`resize`, (e) => {
    const scrollElem = document.querySelector('.sidebar__panel')
    const scrollbar = document.querySelector('.scrollbar')

    scrollInit(scrollElem, scrollbar)
  }, false);

  const handleBack = () => {
    const el = props.data.default.find(el => el.active === true)
    el.active = false

    props.setSingleView({
      flag: false,
      id: null
    })
  }

  useEffect(() => {
    props.updateData(props.data.default.filter((obj) => {
      return obj.name_Med_punkt.toLowerCase().indexOf(state.search) !== -1;
    }))
  }, [state.search])

  const handleToggleButton = (e) => {
    e.target.classList.toggle('sidebar__toggle-button--active')

    const sidebar = e.target.closest('.sidebar')

    sidebar.classList.toggle('sidebar--hidden')
  }

  return (
    <div className="sidebar">

      <button
        className="sidebar__toggle-button sidebar__toggle-button--a"
        onClick={handleToggleButton}
      >
      </button>

      <div className="sidebar__wrapper">

        <Search
          filterShow={state.filter.show}
          scroll={state.scroll}
          handleInput={HandleInputSearch}
          handleFilter={handleFilterButton}
          updateData={props.updateData}
        />

        <div
          className="sidebar__panel"
          ref={panelScrollRef}
          onScroll={handlePanelScroll}
        >
          {
            props.loading ?
              <div className="sidebar__loader">
                <Preloader
                  active
                  color="blue"
                  flashing={false}
                  size="small"
                />
              </div> :
              props.singleView.flag ?
                <SingleView
                  id={props.data.default.find(el => el.id_Med_punkt === props.singleView.id).id_Med_punkt}
                  back={(e) => handleBack(e)}
                /> :
                <ListView
                  loading={props.loading}
                  list={props.data.modified}
                  searchViewClick={searchViewClick}
                />
          }

          <Scrollbar />
        </div>

      </div>

    </div>
  )
}