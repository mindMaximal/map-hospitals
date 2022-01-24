import React, {useCallback, useEffect, useState} from 'react'
import './InlineGallery.scss'
import {useHttp} from "../hooks/http.hook"
import {UploaderImage} from "./UploaderImage"
import {ModalDelete} from "./ModalDelete"
import {GalleryEditItem} from "./GalleryEditItem"
import {GalleryItem} from "./GalleryItem"

export const InlineGallery = (props) => {

  const [state, setState] = useState({
    data: [],
    visible: false,
    src: null
  })

  const [deletedImg, setDeletedImg] = useState({
    id: null,
    src: null
  })

  const {loading, error, request, clearError} = useHttp()

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
    const img = e.target.closest('.gallery-item').querySelector('img')

    setState({
      ...state,
      visible: !state.visible,
      src: img.src
    })
  }

  const handleGalleryViewClick = () => {
    setState({
      ...state,
      visible: !state.visible,
      src: null
    })
  }

  const addImg = (img) => {
    // ToDo: удалить только что загруженный файл - удалить его из галереи загруженных файлов (из стейта)
    console.log(img)
    setState({
      ...state,
      data: [img, ...state.data]
    })
  }

  const deleteImg = (id) => {
    setState({
      ...state,
      data: state.data.filter(el => el.id !== id)
    })
  }

  return (
    <div className={`inline-gallery ${props.className}`}>

      <div>
        <div className="inline-gallery__wrapper">

          {props.edit &&
          <UploaderImage
            className="inline-gallery__slide"
            id={props.id}
            setImages={addImg}
          />
          }

          { loading || props.loading ?
            <>

              <div className="inline-gallery__slide inline-gallery__slide--skeleton" />
              <div className="inline-gallery__slide inline-gallery__slide--skeleton" />
              <div className="inline-gallery__slide inline-gallery__slide--skeleton" />
              <div className="inline-gallery__slide inline-gallery__slide--skeleton" />
            </> :
            state.data.map((el, i) => (
              props.edit ?
                <GalleryEditItem
                  className="inline-gallery__slide"
                  onClick={handleSlideImageClick}
                  setDeletedImg={setDeletedImg}
                  img={el.name}
                  id={el.id}
                  key={i}
                />
                :
                <GalleryItem
                  className="inline-gallery__slide"
                  onClick={handleSlideImageClick}
                  img={el.name}
                  key={i}
                />
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

      <ModalDelete
        deletedImg={deletedImg}
        deleteImg={deleteImg}
      />

    </div>
  )
}