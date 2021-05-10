import React, {useCallback, useEffect, useState} from 'react'
import './Gallery.scss'

import {Carousel} from "react-materialize";
import {useHttp} from "../hooks/http.hook";
export const Gallery = (props) => {

  const [state, setState] = useState({
    data: [],
    visible: false,
    src: null
  })

  const {error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      const fetched = await request('/api/map/single/photo', 'POST', body)

      setState({
        data: fetched
      })

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData({
      id: props.id
    })
  }, [fetchData])

  const handleSlideImageClick = (e) => {
    const { target } = e

    setState({
      ...state,
      visible: !state.visible,
      src: target.src
    })
  }

  const handleGalleryViewClick = () => {
    setState({
      ...state,
      visible: !state.visible,
      src: null
    })
  }

  return (
    <div>
      {
        state.data.length > 0 &&
        <div>
          <Carousel
            carouselId="Carousel-2"
            className="white-text center gallery"
            options={{
              fullWidth: true,
              shift: 0,
              indicators: false,
              padding: 10,
            }}
          >
            {
              state.data.map((el, i) => (
                <div
                  className="gallery__slide"
                  key={i}
                >
                  <img
                    alt="Photo"
                    src={'../photo/' + el.name}
                    onClick={handleSlideImageClick}
                  />
                </div>
              ))
            }


          </Carousel>

          {
            state.visible ?
              <div
                className="gallery-view"
                onClick={handleGalleryViewClick}
              >

                <img
                  src={state.src}
                  alt="Photo"
                  className="gallery-view__img"
                />

              </div> :
              null
          }

        </div>
      }
    </div>

  )
}