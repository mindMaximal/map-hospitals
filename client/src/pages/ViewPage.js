import React, {useCallback, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"
import './TablePage.scss'
import {PageHeader} from "../components/PageHeader"
import {TableView} from "../components/TableView"
import {ContextMenu} from "../components/ContextMenu"
import {ProgressBar} from "react-materialize"

export const ViewPage = () => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({
    data: [],
    headers: []
  })

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/view', 'POST')

      setState({
        ...state,
        data: fetched.data,
        headers: fetched.headers
      })
    } catch (e) {}
  }, [request])


  useEffect(() => {
    fetchData()
  }, [fetchData])


  return (
    <div className="view">

      <div className="container view__container">

         <PageHeader
            className="view__header"
         />

      </div>

      <div className="container table-container">

        {
          loading ? <ProgressBar/> :
            state.data.length === 0 ? 'Элементов не найдено, пожалуйста, измените критерии поиска' :
              <TableView
                data={state.data}
                headers={state.headers}
              />

        }
        <ContextMenu />

      </div>

    </div>
  )
}