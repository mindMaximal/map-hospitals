import React, {useEffect, useState, useCallback} from 'react'
import 'materialize-css'
import {Button} from 'react-materialize'
import './Navigation.scss'
import {ReportPanel} from "./ReportPanel"
import {useHttp} from "../hooks/http.hook"
import {Link} from "react-router-dom"
import {Legend} from "./Legend"

export const Navigation = () => {

  const {error, request, clearError} = useHttp()

  const [state, setState] = useState({
    area: []
  })

  const [reportState, setReportState] = useState({
    show: false
  })

  const [legendState, setLegendState] = useState({
    show: false
  })

  const handleReportButtonClick = () => {
    setReportState({...reportState, 'show': !reportState.show})

    if (legendState.show) {
      setLegendState({...legendState, show: !legendState.show})
    }
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

  const handleLegendButtonClick = () => {
    setLegendState({...legendState, show: !legendState.show})

    if (reportState.show) {
      setReportState({...reportState, 'show': !reportState.show})
    }
  }

  const setLegendShowHandle = () => {
    setLegendState({...legendState, show: !legendState.show})
  }

  const handleReportPanelHide = () => {
    setReportState({...reportState, 'show': !reportState.show})
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (

    <div className="navigation">

      <div className="navigation__nav navigation__nav--top">

        <Link to="/management">
          <Button
            className="navigation__button blue darken-4"
            node="button"
            waves="light"
          >
            Управление
          </Button>
        </Link>

        <Button
          className="navigation__button blue darken-4"
          node="button"
          waves="light"
          disabled
        >
          Войти
        </Button>

      </div>

      <div className="navigation__nav navigation__nav--bottom">


        <div className="navigation__controls">

          <Button
            className="navigation__button"
            node="button"
            waves="light"
            onClick={handleLegendButtonClick}
          >
            Легенда
          </Button>

          <Button
            className="navigation__button"
            node="button"
            waves="light"
            onClick={handleReportButtonClick}
          >
            Отчеты
          </Button>

          <Link to="/view">
            <Button
              className="navigation__button blue darken-4"
              node="button"
              style={{
                marginRight: '5px'
              }}
              waves="light"
            >
              Таблица
            </Button>
          </Link>

        </div>

        { reportState.show &&
          <ReportPanel
            hide={handleReportPanelHide}
            area={state.area}
            closeModal={handleReportButtonClick}
          />
        }

        { legendState.show &&
          <Legend
            setShow={setLegendShowHandle}
          />
        }
      </div>

    </div>
  )
}