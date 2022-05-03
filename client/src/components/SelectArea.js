import {Select} from "react-materialize"
import React, {useCallback, useEffect, useState} from "react"
import './UploaderImage.scss'
import {useHttp} from "../hooks/http.hook"

export const SelectArea = (props) => {

  const [state, setState] = useState([])
  const [value, setValue] = useState(0)

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

      fetched.unshift({id: 0, [`${props.query}_name`]: 'Выберите ' + props.label.toLowerCase()})
      
      setState(fetched)
    } catch (e) {}
  }, [request, props.query, props.value])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (props.value) {
      setValue(props.value)
    } else {
      setValue(0)
    }
  }, [props])

  //ToDo: баг с выбором населенного пункта: дефолтное значение не выбирается

  return (
    <div
      className={`select-area ${props.className}`}
    >
      {<Select
          name={props.name}
          onChange={props.onChange}
          label={(props.label || "Название") + ':'}
          options={props.options || {}}
          value={value.toString()}
          disabled={props.disabled || loading || props.loading || !(state.length > 0)}
        >
          {!loading && state && state.length > 0 ? state.map((el, i) => (
            <option value={el.id.toString()} key={i}>
              {el[`${props.query}_name`]}
            </option>
          )) :
            null
          }
        </Select>
      }
    </div>
  )
}