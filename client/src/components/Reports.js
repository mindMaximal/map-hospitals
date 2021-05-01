import React, {useEffect, useState, useCallback} from 'react'
import 'materialize-css';
import {Button} from 'react-materialize';
import './Reports.scss'
import {ReportPanel} from "./ReportPanel";
import {useHttp} from "../hooks/http.hook";

export const Reports = (props) => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({
    area: []
  })

  const [reportState, setReportState] = useState({
    show: false
  })

  const handleReportButton = (e) => {
    setReportState({...reportState, 'show': !reportState.show})
  }

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      console.log('body', body)

      const fetched = await request('/api/reports/area', 'POST', body)

      console.log(fetched)

      setState({
        ...state,
        area: fetched
      })

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="reports">

      <div className="reports__controls">

        <Button
          node="button"
          style={{
            marginRight: '5px'
          }}
          waves="light"
          onClick={handleReportButton}
        >
          Отчеты
        </Button>
      </div>

      { reportState.show ?
        <ReportPanel
          area={state.area}
        />
        : null
      }
    </div>
  )
}