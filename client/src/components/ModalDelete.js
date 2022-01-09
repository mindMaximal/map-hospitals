import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import {Button, Modal} from "react-materialize"

export const ModalDelete = (props) => {

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
      props.deleteImg(id)
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