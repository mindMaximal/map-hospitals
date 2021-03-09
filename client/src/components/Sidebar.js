import React, {useContext, useEffect, useState} from 'react'
import {ListView} from './ListView'
import './Sidebar.scss'
import {SingleView} from "./SingleView"
import {Search} from "./Search"
import {Scrollbar} from "./Scrollbar";
import {useMap} from "../hooks/map.hook";

export const Sidebar = (props) => {
  let panelScrollRef = React.createRef()
  const {updateData, getData} = useMap()

  const [state, setState] = useState({
    scroll: false,
    search: null,
    singleView: false,
    filter: {
      show: false
    }
  })

  const handleFilterButton = (e) => {
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

    scrollbar.querySelector('.scrollbar__slider').style.height = viewHeight * viewHeight / scrollHeight + 'px';
  }

  const handlePanelScroll = (e) => {
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

  const handleBack = () => {
    setState({...state, 'singleView': false})
  }

  useEffect(() => {
    const scrollElem = document.querySelector('.sidebar__panel')
    const scrollbar = document.querySelector('.scrollbar')

    scrollInit(scrollElem, scrollbar)

    console.log(getData().modified)
  }, [getData().modified])

  useEffect(() => {
    updateData(getData().default.filter((obj) => {
      return obj.name.toLowerCase().indexOf(state.search) !== -1;
    }))
  }, [state.search])

  return (
    <div className="sidebar">

      <div className="sidebar__wrapper">

        <Search
          filterShow={state.filter.show}
          scroll={state.scroll}
          handleInput={HandleInputSearch}
          handleFilter={handleFilterButton}
        />

        <div
          className="sidebar__panel"
          ref={panelScrollRef}
          onScroll={handlePanelScroll}
        >
          {!props.loading && props.singleView ? <SingleView elem={getData().modified[0]} back={handleBack}/> :
            <ListView
              loading={props.loading}
              list={getData().modified}
            />
          }

          <Scrollbar />

        </div>

      </div>

    </div>
  )
}