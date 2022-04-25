import React, {useCallback, useEffect, useState} from 'react'
import './Location.scss'
import {Preloader, Table} from "react-materialize";
import {useHttp} from "../hooks/http.hook";

export const Regions = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState([])

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/location/regions', 'POST')

      setState(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="location">

      <h2 className="location__title">Регионы</h2>

      <div className="location__content">

        { loading &&
          <div className="location__loader">
            <Preloader />
          </div>
        }

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
              Районы, шт
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
              >
                <td>
                  {el.name}
                </td>
                <td>
                  {el.districts_count}
                </td>
                <td>
                </td>
              </tr>
            ))
            : 'Нет данных'}

          </tbody>

        </Table>

      </div>

    </div>
  )
}