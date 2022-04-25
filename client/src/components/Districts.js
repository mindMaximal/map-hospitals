import React, {Component, useCallback, useEffect, useState} from 'react'
import './Location.scss'
import {Button, Checkbox, Modal, Preloader, Select, Table, TextInput} from "react-materialize"
import {useHttp} from "../hooks/http.hook"
import {Scrollbars} from "react-custom-scrollbars"

export const Districts = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState([])
  const [selectData, setSelectData] = useState([])
  const [modal, setModal] = useState({
    id: null,
    open: false
  })

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/location/districts', 'POST')
      const fetchedRegions = await request('/api/location/regions', 'POST')

      setState(fetched)
      setSelectData(fetchedRegions)
    } catch (e) {}
  }, [request])

  const fetchFilteredData = useCallback(async (id) => {
    try {
      const fetched = await request('/api/location/districts', 'POST', {id})

      setState(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSelectChange = (e) => {
    fetchFilteredData(e.target.value)
  }

  const handleTableRowClick = (el) => {
    setModal({
      el: el,
      open: true
    })
  }

  useEffect(() => {
    console.log('Modal', modal)
  }, [modal])

  return (
    <div className="location">

      <h2 className="location__title">Районы</h2>

        <div className="location__content">

          { loading &&
            <div className="location__loader">
              <Preloader />
            </div>
          }

          <div className="location__controls">

            <Select
              id="report-area"
              className="location__select"
              multiple={false}
              onChange={(e) => handleSelectChange(e)}
              value=""
            >
              <option
                disabled
                value=""
              >
                Выберите регион
              </option>
              {
                selectData.map((el, i) => (
                  <option
                    key={i}
                    value={el.id}
                  >
                    {el.name}
                  </option>
                ))
              }
            </Select>

          </div>

          <div className="location__table-wrapper">

            <CustomScrollbars>

              <Table
                className="location__table"
                responsive
              >

                <thead>

                <tr>
                  <th data-field="name">
                    Наименование
                  </th>
                  <th data-field="districts">
                    Населенные пункты, шт
                  </th>
                  <th data-field="locations">
                    -
                  </th>
                </tr>

                </thead>

                <tbody>

                {state && state.length > 0 ? state.map((el, i) => (
                    <tr
                      key={i}
                      onClick={() => handleTableRowClick(el)}
                    >
                      <td>
                        {el.name}
                      </td>
                      <td>
                        {el.localities_count}
                      </td>
                      <td>
                      </td>
                    </tr>
                  ))
                  : 'Нет данных'}

                </tbody>

              </Table>

            </CustomScrollbars>

          </div>

          <div className="location__controls">

            <Button
              node="button"
              style={{
                marginRight: '5px'
              }}
              waves="light"
            >
              Добавить
            </Button>

          </div>

        </div>

      <ModalInfo
        open={modal.open}
        selectData={selectData}
        el={modal.el}
        setModal={setModal}
      />

    </div>
  )
}

class CustomScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        renderView={props => <div {...props} className="management__scroll-view"/>}>
        {this.props.children}
      </Scrollbars>
    );
  }
}

const ModalInfo = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({})

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (id) => {
    try {
      console.log('id', props.id)

      const fetched = await request('/api/location/district', 'POST', {id: props.id})

      console.log(fetched)

      setState(fetched)
    } catch (e) {}
  }, [request])

  return (
    <Modal
      actions={[
        <Button
          node="button"
          waves="light"
          className="red darken-3"
        >
          Удалить
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
      bottomSheet={false}
      fixedFooter={false}
      className="add-panel"
      id="context-menu-add-modal"
      open={props.open}
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        onCloseEnd: () => props.setModal({
          id: null,
          open: false
        }),
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%'
      }}

    >

      <div>

        <Select
          id="report-area"
          className="location__select"
          multiple={false}
          //onChange={(e) => handleSelectChange(e)}
          value=""
        >
          <option
            disabled
            value=""
          >
            Выберите регион
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

        <div>
          {props.el ? props.el.name : 'Неизвестно'}
        </div>

      </div>

    </Modal>
  )
}