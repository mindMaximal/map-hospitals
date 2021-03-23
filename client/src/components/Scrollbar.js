import React from 'react'
import './Scrollbar.scss'

/*
*   ToDo
*    - Передвигаемый слайдер
*    - Убирается если окно не скролится
*
* */

export const Scrollbar = (props) => {

  let startDrag = 0

  const documentMouseMoveListener = (event, el) => {
    const offset = event.pageY
    el.style.top = offset + 'px'
    console.log(offset)
  }

  const handleSliderDragEnd = (e) => {
    document.removeEventListener('mousemove', documentMouseMoveListener(e, e.target), false)
  }

  const handleSliderDragStart = (e) => {
    console.log('Start', e)
    const el = e.target

    document.addEventListener('mousemove', documentMouseMoveListener(e, el), false)
  }

  return (
    <div className="scrollbar">
      <div className="scrollbar__slider"
        onDragStart={(e) => handleSliderDragStart(e)}
        onDragEnd={(e) => handleSliderDragEnd(e)}
      />
    </div>
  )
}