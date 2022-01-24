import React from 'react'
import './Scrollbar.scss'

export const Scrollbar = (props) => {

  let startDrag = 0

  const documentMouseMoveListener = (event, el) => {
    const offset = event.pageY
    el.style.top = offset + 'px'
  }

  const handleSliderDragEnd = (e) => {
    document.removeEventListener('mousemove', documentMouseMoveListener(e, e.target), false)
  }

  const handleSliderDragStart = (e) => {
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