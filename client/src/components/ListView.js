import React from 'react'
import './ListView.scss'
import {SearchView} from "./SearchView";

export const ListView = (props) => {
  return (
    <div className="list-view">
      {!props.loading ?  props.list.length ? props.list.map((view, i) => (
        <SearchView
          key={i}
          name={view.name}
          addres={view.address}
          id={view.id}
          searchViewClick={props.searchViewClick}
        />
      )) :
        <div className="list-view--empty">
          Таких элементов не найдено
        </div> :
        'loading 1'
      }
    </div>
  )
}