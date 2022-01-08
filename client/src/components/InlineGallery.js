import React, {useCallback, useEffect, useState} from 'react'
import './InlineGallery.scss'
import {useHttp} from "../hooks/http.hook"
import {UploaderImage} from "./UploaderImage";
import {Button, Icon, Modal} from "react-materialize";

export const InlineGallery = (props) => {

  const [state, setState] = useState({
    data: [],
    visible: false,
    src: null
  })

  // ToDo: очистка file input после загрузки фото

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

  const setImages = (img) => {
    // ToDo: удалить только что загруженный файл - удалить его из галереи загруженных файлов (из стейта)
    console.log(img)
    setState({
      ...state,
      data: [img, ...state.data]
    })
  }

  return (
    <div className={`inline-gallery ${props.className}`}>
      {
        state.data.length > 0 &&
        <div>
          <div className="inline-gallery__wrapper">

            {props.edit &&
              <UploaderImage
                className="inline-gallery__slide"
                id={props.id}
                setImages={setImages}
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
                    deletedImg={deletedImg}
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
      }

      <ModalDelete
        deletedImg={deletedImg}
        state={state}
        setData={setState}
      />

    </div>

  )
}

const GalleryItem = (props) => {

  return (
    <div
      className={`gallery-item ${props.className}`}
    >
      <img
        alt="Photo"
        src={'../attached/images/' + props.img}
      />
      <div
        className="gallery-item__preview"
        onClick={props.onClick}
      >
        <button
          className="gallery-item__button"
        >
          <Icon>search</Icon>
        </button>
      </div>
    </div>
  )
}

const GalleryEditItem = (props) => {

  const handleImgDeleteButton = (e) => {
    const img = e.target.closest('.gallery-item').querySelector('img')

    props.setDeletedImg({
      id: props.id,
      src: img.src
    })
  }

  return (
    <div
      className={`gallery-item gallery-item--edit ${props.className}`}
    >
      <img
        alt="Photo"
        src={'../attached/images/' + props.img}
      />
      <div className="gallery-item__preview">
        <button
          className="gallery-item__button"
          onClick={props.onClick}
        >
          <Icon>search</Icon>
        </button>
        <button
          className="gallery-item__button modal-trigger"
          href="#modal-img-delete"
          onClick={handleImgDeleteButton}
        >
          <Icon>clear</Icon>
        </button>
      </div>
    </div>
  )
}

const ModalDelete = (props) => {

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (id, name) => {
    try {
      const fetched = await request(`/api/upload/images/delete`, 'POST', {id, name})
      // ToDo: проверка авторизации по токену

      return true
    } catch (e) {}
  }, [request])

  const handleDeleteImgButtonClick = (id, src) => {
    let name = src.split('/').pop()

    const result = fetchData(id, name)

    if (result) {
      props.setData({
        ...props.state,
        data: props.state.data.filter(el => el.id !== id)
      })
    }
  }

  return (
    <Modal
      actions={[
        <Button
          className="modal-trigger red darken-3"
          modal="close"
          node="button"
          waves="light"
          style={{
            marginRight: '5px'
          }}
          onClick={() => handleDeleteImgButtonClick(props.deletedImg.id, props.deletedImg.src)}
        >
          Да
        </Button>,
        <Button
          modal="close"
          node="button"
          waves="green"
        >
          Нет
        </Button>
      ]}
      bottomSheet={false}
      fixedFooter={false}
      header="Вы хотите удалить это изображение?"
      id="modal-img-delete"
      className="gallery-item__modal"
      open={false}
      options={{
        dismissible: true,
        endingTop: '30%',
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '20%'
      }}
    >
      <div className="gallery-item__img-wrapper">
        <img src={props.deletedImg.src} alt="Photo"/>
      </div>
    </Modal>
  )
}