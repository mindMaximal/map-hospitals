import React from 'react'
import './Skeleton.scss'

export const Skeleton = () => {


  return (
    <div className="skeleton">

      <div className="skeleton__wrapper">

        <Box width={95}/>

        <Box width={100}/>

        <Box width={80}/>

        <Box width={98}/>

        <Box width={50}/>

      </div>

      <div className="skeleton__wrapper">

        <Box width={100}/>

        <Box width={80}/>

      </div>

      <div className="skeleton__wrapper">

        <Box width={60}/>

      </div>

    </div>
  )

}

export const Box = (props) => {

  const style = {
    width: (props.width || 100) + '%'
  }

  return (
    <span className="skeleton__box" style={style}>0</span>
  )
}