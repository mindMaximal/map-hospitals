import React, {useCallback, useEffect, useState} from 'react'
import './ReportPanel.scss'
import {ProgressBar, Modal, CollapsibleItem, Collapsible, Select, Button, Checkbox, TextInput} from "react-materialize";
import {useHttp} from "../hooks/http.hook";
import {ReportView} from "./ReportView";
import {ReportBuilder} from "./ReportBuilder";

export const ReportPanel = (props) => {

  const [state, setState] = useState()
  const [data, setData] = useState({
    headers: [],
    objects: []
  })

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      console.log('body', body)

      const fetched = await request('/api/reports', 'POST', body)

      setData(fetched)

    } catch (e) {}
  }, [request])

  const handleReportButton = e => {
    fetchData(state)
  }

  const handlePreparedReportsButton = (e) => {
    fetchData({
      ...state,
      title: e.target.getAttribute('data-title'),
      params: e.target.getAttribute('params')
    })

    clearState()
  }

  const clearState = () => {
    setState({})
    /*
    * ToDo
    *  - очистка полей формы
    * */
  }

  useEffect(() => {
    console.log('loading', loading)
  }, [loading])

  return (
    <div className="report-panel shadow">

      <div className="report-panel__wrapper">

        <Collapsible
          className="report-panel__collapsible"
          accordion
        >
          <CollapsibleItem
            expanded={false}
            header="Заготовленные отчеты"
            node="div"
            className="report-panel__collapsible-item"
          >

            <div className="report-panel__wrapper">

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                params={[
                  'name',
                  'post',
                  'rates',
                  'date'
                ]}
                href="#report-modal"
                data-title="об укомплектованности мед. работниками"
              >
                Отчет об укомплектованности мед. работниками
              </Button>

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                href="#report-modal"
                data-title="о ФАПах с возможностью оказания первой помощи"
              >
                Отчет о медицинских пунктах с возможностью оказания первой медицинской помощи
              </Button>

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                href="#report-modal"
                data-title="о ФАПах с аптеками"
              >
                Отчет о медицинских пунктах с аптеками
              </Button>

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                href="#report-modal"
                data-title="о ФАПах с аптеками"
              >
                Отчёт о медицинских пунктах с просроченной реконструкцией
              </Button>

            </div>

          </CollapsibleItem>

          <CollapsibleItem
            expanded
            header="Конструктор отчетов"
            node="div"
            className="report-panel__collapsible-item"
          >

            <ReportBuilder
              setParam={setState}
              params={state}
              handleReportButton={handleReportButton}
            />

          </CollapsibleItem>

        </Collapsible>

      </div>

      <ReportView
        loading={loading}
        data={data}
      />

    </div>
  )
}