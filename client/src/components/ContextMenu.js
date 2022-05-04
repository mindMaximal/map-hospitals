import {Button} from "react-materialize"
import React, {useEffect, useRef} from "react"
import "./ContextMenu.scss"
import {AddPanel} from "./AddPanel"
import {Link} from "react-router-dom";

export const ContextMenu = (props) => {

  const handleAddClick = (e) => {
    console.log(e)
  }

  const menuRef = useRef(null)

  const setView = (x, y) => {
    const el = menuRef.current

    if (!el)
      return

    el.style = `top: ${y}px; left: ${x}px; display: flex;`
  }

  const closeMenu = (e) => {
    const { target } = e
    const el = menuRef.current

    if (target !== el && !el.contains(target)) {
      el.style.display = 'none'
    }
  }

  useEffect(() => {
    document.addEventListener('click', closeMenu)

    return () => {
      document.removeEventListener('click', closeMenu)
    }
  }, [])

  useEffect(() => {
    if (props.view.visible) {
      setView(props.view.x, props.view.y)
    }
  }, [props])

  console.log(props)

  return (
    <div
      ref={menuRef}
      className={`context-menu ${props.view.visible && 'context-menu--active'}`}
      // onContextMenu={(e) => {e.preventDefault()}}
    >

      <Link to='/add/'>
        <Button
          node="button"
          waves="light"
          className="context-menu__button modal-trigger"
          onClick={handleAddClick}
          href="#context-menu-add-modal"
        >
          Добавить
        </Button>
      </Link>

      <Link to={`/edit/${props.view.id}`}>
        <Button
          node="button"
          waves="light"
          className="context-menu__button"
        >
          Изменить
        </Button>
      </Link>

      <AddPanel />

    </div>
  )
}