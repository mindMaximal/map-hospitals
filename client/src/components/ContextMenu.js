import {Button, Modal} from "react-materialize"
import React from "react"
import "./ContextMenu.scss"
import {AddPanel} from "./AddPanel"

export const ContextMenu = (props) => {

  const handleAddClick = (e) => {



  }

  return (
    <div
      className="context-menu"
      // onContextMenu={(e) => {e.preventDefault()}}
    >

      <Button
        node="button"
        waves="light"
        className="context-menu__button modal-trigger"
        onClick={handleAddClick}
        href="#context-menu-add-modal"
      >
        Добавить
      </Button>

      <Button
        node="button"
        waves="light"
        className="context-menu__button"
      >
        Изменить
      </Button>

      <Button
        node="button"
        waves="light"
        className="context-menu__button red"
      >
        Удалить
      </Button>

      <AddPanel />

    </div>
  )
}