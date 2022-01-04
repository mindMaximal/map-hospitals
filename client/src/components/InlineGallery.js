import React, {useCallback, useEffect, useState} from 'react'
import './InlineGallery.scss'
import {useHttp} from "../hooks/http.hook"

export const InlineGallery = (props) => {

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
      // ToDo: проверка авторизации по токену

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
    <div className="inline-gallery">
      {
        state.data.length > 0 &&
        <div>
          <div className="inline-gallery__wrapper">

            {
              state.data.map((el, i) => (
                <div
                  className="inline-gallery__slide"
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

          </div>

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