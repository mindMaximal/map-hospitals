import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import './InlineRates.scss'
import {RatesItem} from "./RatesItem"
import {RatesEditItem} from "./RatesEditItem"
import {RatesAddItem} from "./RatesAddItem"

export const InlineRates = (props) => {

  const [state, setState] = useState([])

  const {error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request(`/api/detail/rates/${props.id}`, 'GET', null)

      setState(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData({
      id: props.id
    })
  }, [fetchData])

  const addRates = () => {
    const tempArray = state.slice(0)

    tempArray.unshift({
      position: '',
      rate_occupied: 0,
      rate_full: 0,
      medical_center_id: props.id,
      isNew: true
    })

    setState(tempArray)
  }

  const updateData = () => {
    fetchData({
      id: props.id
    })
  }

  return (
    <div className={`inline-rates ${props.className}`}>

      <h4 className="inline-rates__title">
        Укомплектованность
      </h4>

      <div className="inline-rates__wrapper">

        {
          props.mode === 'edit' &&
            <RatesAddItem
              className="inline-rates__item"
              addItem={() => addRates()}
            />
        }

        {state && state.length > 0 ? state.map((el, i) => {

            if (props.mode === 'edit') {
              return (
                <RatesEditItem
                  key={i}
                  className="inline-rates__item"
                  el={el}
                  update={updateData}
                />
              )
            } else {
              return (
                <RatesItem
                  key={i}
                  className="inline-rates__item"
                  el={el}
                />
              )
            }

        }) :
          <div className="inline-rates__empty">
            Показатели еще не добавлены
          </div>
        }

      </div>

    </div>
  )
}