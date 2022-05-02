import React from 'react'
import './RatesAddItem.scss'
import {Icon} from "react-materialize"

export const RatesAddItem = (props) => {

  const handleAddFieldClick = () => {
    props.addItem()
  }

  return (
    <div
      className={`rates-add-item ${props.className}`}
      onClick={() => handleAddFieldClick()}
    >
      <Icon small>add</Icon>
    </div>
  )
}