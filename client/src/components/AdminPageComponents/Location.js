import React, {useCallback, useEffect, useState} from 'react'
import './Location.scss'
import {Button,Preloader, Select, Table} from "react-materialize"
import {useHttp} from "../../hooks/http.hook"
import {CustomScrollbars} from "./CustomScrollbar.class"
import {ModalAdd} from "./ModalAdd"
import {ModalInfo} from "./ModalInfo"

export const Location = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState([])
  const [selectData, setSelectData] = useState([])
  const [select, setSelect] = useState(0)
  const [modalInfo, setModalInfo] = useState({
    id: null,
    open: false
  })
  const [modalAdd, setModalAdd] = useState({
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
      const fetched = await request(`api/location/${props.queries}`, 'POST')
      setState(fetched)

      if (props.parent) {
        const fetchedRegions = await request(`/api/location/${props.parentQueries}`, 'POST')

        setSelectData(fetchedRegions)
        setSelect(0)
      }
    } catch (e) {}
  }, [request])

  const fetchFilteredData = useCallback(async (id) => {
    try {
      const fetched = await request(`/api/location/${props.queries}`, 'POST', {id})

      setState(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchFilteredData(select)
  }, [select])

  const handleSelectChange = (e) => {
    setSelect(e.target.value)
  }

  const handleTableRowClick = (el) => {
    setModalInfo({
      el: el,
      open: true
    })
  }

  return (
    <div className="location">

      <h2 className="location__title">{props.title}</h2>

        <div className="location__content">

          { loading &&
            <div className="location__loader">
              <Preloader />
            </div>
          }

          <div className="location__controls">

            {props.parent ?
              <Select
                className="location__select"
                onChange={(e) => handleSelectChange(e)}
                value={select.toString()}
              >
                <option
                  disabled
                  value="0"
                >
                  Выберите {props.parent}
                </option>
                {
                  selectData.map((el, i) => (
                    <option
                      key={i}
                      value={el.id.toString()}
                    >
                      {el.name}
                    </option>
                  ))
                }
              </Select> :
              <div className="location__empty" />
            }

          </div>

          <div className="location__table-wrapper">

            <CustomScrollbars>

              <Table
                className="location__table"
              >

                <thead>

                <tr>
                  <th data-field="num">
                    №
                  </th>
                  <th data-field="name">
                    Наименование
                  </th>
                  <th data-field={props.queries}>
                    {props.label}
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
                        {i + 1}
                      </td>
                      <td>
                        {el.name}
                      </td>
                      <td className="location__numbers">
                        {el[props.labelQuery]}
                      </td>
                    </tr>
                  ))
                  :
                    <tr>
                      <th>
                        'Нет данных'
                      </th>
                    </tr>
                }

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
              onClick={() => setModalAdd({open: true})}
            >
              Добавить
            </Button>

          </div>

        </div>

      <ModalInfo
        name={props.name}
        parent={props.parent}
        query={props.query}
        parentQuery={props.parentQuery}
        open={modalInfo.open}
        selectData={selectData}
        el={modalInfo.el}
        setModal={setModalInfo}
        update={() => {
          setModalInfo({open: false})
          fetchData()
        }}
      />

      <ModalAdd
        name={props.name}
        parent={props.parent}
        query={props.query}
        parentQuery={props.parentQuery}
        open={modalAdd.open}
        selectData={selectData}
        setModal={setModalAdd}
        update={() => {
          setModalAdd({open: false})
          fetchData()
        }}
      />

    </div>
  )
}