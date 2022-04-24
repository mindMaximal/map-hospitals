import React, {useContext, useEffect, useState} from 'react'
import {ListView} from './ListView'
import './Sidebar.scss'
import {MapContext} from "../context/MapContext"
import {SingleView} from "./SingleView"
import {Search} from "./Search"
import {Skeleton} from "./Skeleton"
import CustomScrollbars from "./CustomScrollbar";
import {SingleViewOrg} from "./SingleViewOrg";

export const Sidebar = (props) => {
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

    const el = props.data.default.find(el => el.id === id)
    el.active = true

    setMapState({
      ...mapState,
      zoom: 12,
      'center': [el.latitude, el.longitude]}
    )

    props.setSingleView({
      flag: true,
      id: el.id
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

  const handlePanelScroll = (e) => {
    const scrollTop = e.target.scrollTop

    console.log()

    if (scrollTop > 50) {
      setState({...state, 'scroll': true})
    } else {
      setState({...state, 'scroll': false})
    }
  }

  const handleBack = () => {
    let data

    if (props.singleView.typeId === 3) {
      data = props.orgs
    } else {
      data = props.data.default
    }

    const el = data.find(el => el.active === true)

    if (el)
      el.active = false

    props.updateData(props.data.default)

    props.setSingleView({
      flag: false,
      id: null
    })
  }

  useEffect(() => {
    props.updateData(props.data.default.filter((obj) => {
      return obj.name.toLowerCase().indexOf(state.search) !== -1;
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
        >
          {
            props.loading ?
              <div className="sidebar__loader">

                <Skeleton />

                <Skeleton />

                <Skeleton />

                <Skeleton />

              </div> :

                <CustomScrollbars
                  onScroll={handlePanelScroll}
                > {props.singleView.flag ?
                  props.singleView.typeId === 3 ?
                    <SingleViewOrg
                      id={props.orgs.find(el => el.id === props.singleView.id).id}
                      back={(e) => handleBack(e)}
                      updateData={props.updateData}
                    />
                    :
                    <SingleView
                      id={props.data.default.find(el => el.id === props.singleView.id).id}
                      back={(e) => handleBack(e)}
                    />
                  :
                  <ListView
                    loading={props.loading}
                    list={props.data.modified}
                    searchViewClick={searchViewClick}
                  />}
                </CustomScrollbars>
          }

          {/*<Scrollbar />*/}
        </div>

      </div>

    </div>
  )
}