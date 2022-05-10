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

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request(`/api/detail/images/${props.id}`, 'GET', null)

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
            carouselId="Carousel"
            className="white-text center gallery"
            options={{
              fullWidth: false,
              shift: 0,
              numVisible: 5,
              indicators: false,
              padding: 10,
              dist: 0
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
                    src={'../attached/images/' + el.name}
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