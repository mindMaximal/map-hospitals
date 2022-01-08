import {Select} from "react-materialize"
import React, {useCallback, useEffect, useState} from "react"
import './UploaderImage.scss'
import {useHttp} from "../hooks/http.hook"

export const SelectArea = (props) => {

  const [state, setState] = useState([])

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request(`/api/address/${props.query}`, 'GET', null)
      // ToDo: проверка авторизации по токену

      setState(fetched)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  //ToDo: баг с выбором населенного пункта: дефолтное значение не выбирается

  return (
    <div
      className={`select-area ${props.className}`}
    >
      {!loading &&
        <Select
          id={props.id}
          label={props.label || "Название"}
          options={props.options || {}}
          value={props.value}
          disabled={loading || props.loading || !(state.length > 0)}
        >
          {state && state.length > 0 ? state.map((el, i) => (
            <option value={el.id} key={i}>
              {el[`${props.query}_name`]} {el.id === props.value ? '!': null}
            </option>
          )) : null}
        </Select>
      }
    </div>
  )
}