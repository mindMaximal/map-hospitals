import {useHttp} from "../../hooks/http.hook"
import React, {useCallback, useEffect, useState} from "react"
import {Button, Modal, Select, TextInput} from "react-materialize"

export const ModalInfo = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({
    id: null,
    name: null,
    [props.parentQuery]: 0
  })
  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (el) => {
    try {
      const fetched = await request(`/api/location/update/${props.query}`, 'POST', {
        id: el.id,
        name: el.name,
        [props.parentQuery + '_id']: el[props.parentQuery]
      })

      if (fetched.success) {
        props.update()
      }
    } catch (e) {}
  }, [request])

  useEffect(() => {
    if (props.el) {
      setState({
        id: props.el.id,
        name:  props.el.name.trim(),
        [props.parentQuery]: props.el[props.parentQuery + '_id']
      })
    }
  }, [props])

  const fetchDelete = useCallback(async (el) => {
    try {
      const fetched = await request(`/api/location/delete/${props.query}`, 'POST', {id: el.id})

      if (fetched.success) {
        props.update()
      }
    } catch (e) {}
  }, [request])

  const handleFieldChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const handleDeleteButtonClick = (e) => {
    fetchDelete(state)
  }

  return (
    <Modal
      bottomSheet={false}
      fixedFooter={true}
      className="location-modal"
      actions={[
        <Button
          node="button"
          style={{
            marginRight: '5px'
          }}
          waves="light"
          onClick={() => fetchData(state)}
          disabled={loading}
        >
          Сохранить
        </Button>,
        <Button
          modal="close"
          node="button"
          waves="light"
          className="red darken-3"
          disabled={loading}
        >
          Закрыть
        </Button>
      ]}
      open={props.open}
      options={{
        dismissible: true,
        endingTop: '0',
        inDuration: 250,
        onCloseEnd: () => props.setModal({
          id: null,
          open: false
        }),
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.3,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '0'
      }}
    >

      <div>

        <header className="location-modal__header">
          <h4 className="location-modal__title">Редактирование - {props.name}</h4>

          <Button
            node="button"
            waves="light"
            style={{
              marginRight: '5px'
            }}
            className="modal-trigger red darken-3"
            href={"#modal-delete-" + props.query}
            disabled={loading}
          >
            Удалить
          </Button>
        </header>

        <div className="location-modal__block">

          {props.parent &&
            <Select
              id="location-select"
              className="location__select"
              multiple={false}
              name={[props.parentQuery]}
              onChange={handleFieldChange}
              value={props.selectData ? state[props.parentQuery] : null}
              label={props.parent + ':'}
            >
              <option
                disabled
                value="0"
              >
                Выберите {props.parent}
              </option>
              {
                props.selectData.map((el, i) => (
                  <option
                    key={i}
                    value={el.id}
                  >
                    {el.name}
                  </option>
                ))
              }
            </Select>
          }

        </div>

        <div className="location-modal__block">
          <TextInput
            value={state.name}
            name="name"
            onChange={handleFieldChange}
            label="Наименование:"
          />
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
        header={"Вы действительно хотите удалить этот " + props.name}
        id={"modal-delete-" + props.query}
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
              Будет удален следующий {props.name}: <b>{state.name}</b>
            </div>
        </div>
      </Modal>

    </Modal>
  )
}