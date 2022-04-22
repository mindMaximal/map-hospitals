import React, {useEffect, useState, useCallback} from 'react'
import 'materialize-css';
import {Button} from 'react-materialize';
import './Reports.scss'
import {ReportPanel} from "./ReportPanel";
import {useHttp} from "../hooks/http.hook";
import {Link} from "react-router-dom";
import {Legend} from "./Legend";

export const Reports = () => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({
    area: []
  })

  const [reportState, setReportState] = useState({
    show: false
  })

  const handleReportButton = () => {
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

      console.log('Area fetched:', fetched)

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
        >
          Легенда
        </Button>

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

        <Link to="/view">
          <Button
            node="button"
            style={{
              marginRight: '5px'
            }}
            waves="light"
            className={"blue darken-4"}
          >
            Таблица
          </Button>
        </Link>

      </div>

      { reportState.show ?
        <ReportPanel
          area={state.area}
          closeModal={handleReportButton}
        />
        : null
      }

      { true ?
        <Legend />
        : null

      }
    </div>
  )
}