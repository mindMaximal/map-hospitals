import React, {useEffect, useState, useCallback} from 'react'
import './RatesEditItem.scss'
import {Button, Modal, TextInput} from "react-materialize"
import {useHttp} from "../hooks/http.hook";

export const RatesEditItem = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [changed, setChanged] = useState(false)
  const [state, setState] = useState({
    id: null,
    position: '',
    rate_occupied: null,
    rate_full: null,
    medical_center_id: null
  })

  useEffect(() => {
    setState({
      id: props.el.id,
      position: props.el.position,
      rate_occupied: props.el.rate_occupied,
      rate_full: props.el.rate_full,
      medical_center_id: props.el.medical_center_id
    })
  }, [props])

  useEffect(() => {
    if (checkingMatch(props.el, state)) {
      setChanged(true)
    } else {
      setChanged(false)
    }
  }, [state])

  const handleInputChange = (e) => {
    if (e.target.type === 'number') {
      setState({...state, [e.target.name]: parseInt(e.target.value)})
    } else {
      setState({...state, [e.target.name]: e.target.value})
    }
  }

  const checkingMatch = (el, state) => {
    for (const key in state) {
      if (el[key] !== state[key]) {
        return true
      }
    }

    return false
  }

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchAdd= useCallback(async (body) => {
    try {
      const fetched = await request(`/api/edit/rate/add`, 'POST', body)

      if (fetched.success) {
        props.update()
      }

    } catch (e) {}
  }, [request])

  const fetchUpdate = useCallback(async (body) => {
    try {
      const fetched = await request(`/api/edit/rate/update`, 'POST', body)

      if (fetched.success) {
        setChanged(false)
        props.update()
      }

    } catch (e) {}
  }, [request])

  const fetchDelete = useCallback(async (body) => {
    try {
      const fetched = await request(`/api/edit/rate/delete`, 'POST', body)

      if (fetched.success) {
        setChanged(false)
        props.update()
      }

    } catch (e) {}
  }, [request])

  const handleAddButtonClick = () => {
    fetchAdd(state)
  }

  const handleSaveButtonClick = () => {
    fetchUpdate(state)
  }

  const handleDeleteButtonClick = () => {
    fetchDelete(state)
  }

  return (
    <div className={`rates-edit-item ${props.className}`}>

      <div className="rates-edit-item__controls">

        {props.el.isNew ?
          <div
            className="rates-edit-item__label"
            onClick={handleAddButtonClick}
          >
            Добавить
          </div> :
          <div
            className="modal-trigger rates-edit-item__delete"
            href={"#modal-delete-rate-" + state.id}
          >
            Удалить
          </div>
        }

        {changed && !props.el.isNew &&
        <div
          className="rates-edit-item__label"
          onClick={handleSaveButtonClick}
        >
          Сохранить
        </div>
        }

      </div>

      <div className="rates-edit-item__content">

        <div className="rates-edit-item__title">
          <TextInput
            name="position"
            label="Должность:"
            value={state.position || ''}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="rates-edit-item__rates">

          <div className="rates-edit-item__input">
            <TextInput
              name="rate_occupied"
              type="number"
              label="Ставок занято:"
              value={state.rate_occupied}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="rates-edit-item__input">
            <TextInput
              name="rate_full"
              type="number"
              label="Ставок всего:"
              value={state.rate_full}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

        </div>

      </div>

      <Modal
        actions={[
          <Button
            className="modal-trigger red darken-3"
            node="button"
            waves="light"
            disabled={loading}
            modal="close"
            style={{
              marginRight: '5px'
            }}
            onClick={(e) => handleDeleteButtonClick(e)}
          >
            Да
          </Button>,
          <Button
            modal="close"
            node="button"
            waves="green"
            disabled={loading}
          >
            Нет
          </Button>
        ]}
        header={"Вы действительно эту должность?"}
        id={"modal-delete-rate-" + state.id}
        options={{
          dismissible: true,
          endingTop: '30%',
          opacity: 0.5,
          outDuration: 250,
          preventScrolling: true,
          startingTop: '20%'
        }}
      >
        <div>
          <div>
            Будет удалена следующая должность: <b>{state.position}</b>
          </div>
        </div>
     </Modal>

    </div>
  )
}