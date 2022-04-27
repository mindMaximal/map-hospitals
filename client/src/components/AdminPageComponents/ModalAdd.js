import {useHttp} from "../../hooks/http.hook"
import React, {useCallback, useEffect, useState} from "react"
import {Button, Modal, Select, TextInput} from "react-materialize"

export const ModalAdd = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({
    name: '',
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
      console.log(el)

      const fetched = await request(`/api/location/add/${props.query}`, 'POST', {
        id: el.id,
        name: el.name,
        [props.parentQuery + '_id']: el[props.parentQuery]
      })

      if (fetched.success) {
        props.update()

        setState({
          id: 0,
          name: '',
          [props.parentQuery]: 0
        })
      }
    } catch (e) {}
  }, [request])

  const handleFieldChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Modal
      bottomSheet={false}
      fixedFooter={true}
      className="location-modal"
      id="context-menu-add-modal"
      actions={[
        <Button
          node="button"
          style={{
            marginRight: '5px'
          }}
          waves="light"
          onClick={() => fetchData(state)}
        >
          Добавить
        </Button>,
        <Button
          modal="close"
          node="button"
          waves="light"
          className="red darken-3"
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
          <h4 className="location-modal__title">Добавление - {props.name}</h4>
        </header>

        <div className="location-modal__block">

          {props.parent &&
            <Select
              id="location-select"
              className="location__select"
              multiple={false}
              name={[props.parentQuery]}
              onChange={handleFieldChange}
              value={state[props.parentQuery]}
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

    </Modal>
  )
}