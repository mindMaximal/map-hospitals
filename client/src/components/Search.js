import React from 'react'
import './ListView.scss'
import {CardPanel, TextInput} from "react-materialize";
import magnifer from "../img/magnifier.svg";
import {ReactComponent as Filter} from "../img/filter.svg";
import {SearchFilter} from "./SearchFilter";

export const Search = (props) => {

  return (
    <CardPanel className={ props.scroll ? "sidebar__header" : "sidebar__header sidebar__header--fixed"}>

      <div className="sidebar__search">

        <TextInput
          id="sidebar-input"
          inputClassName="sidebar__text-input"
          placeholder="Поиск"
          xl
          onChange={props.handleInput}
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
          onClick={props.handleFilter}
        >
          <Filter />
        </button>
      </div>

      { props.filterShow ?
        <SearchFilter
          updateData={props.updateData}
        />
        : null
      }

    </CardPanel>
  )
}