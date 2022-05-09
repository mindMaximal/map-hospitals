import React, {useCallback, useEffect, useState} from 'react'
import './ReportPanel.scss'
import {CollapsibleItem, Collapsible, Button, Select} from "react-materialize"
import {useHttp} from "../hooks/http.hook"
import {ReportView} from "./ReportView"
import {ReportBuilder} from "./ReportBuilder"

export const ReportPanel = (props) => {

  const [state, setState] = useState({
    columns: [],
    conditions: []
  })
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

      const fetched = await request('/api/reports', 'POST', body)

      console.log(fetched)

      setData(fetched)

    } catch (e) {}
  }, [request])

  const handleReportButton = () => {
    setData({
      ...state,
      objects: []
    })

    fetchData(state)
  }

  const handlePreparedReportsButton = (e) => {
    const { target } = e

    setData({
      ...state,
      objects: []
    })

    fetchData({
      ...state,
      area: state.areaPrepared,
      title: target.getAttribute('data-title'),
      columns: target.getAttribute('columns') ?  target.getAttribute('columns').split(',') : []
    })

    //clearState()
  }

  /*const clearState = () => {
    setState({
      columns: [],
      conditions: []
    })
    /!*
    * ToDo
    *  - очистка полей формы
    * *!/
  }*/

  return (
    <div className={`report-panel shadow ${props.className}`}>

      <button
        className="report-panel__close"
        onClick={props.hide}
      >
        &#10006;
      </button>

      <div className="report-panel__wrapper">

        <Collapsible
          className="report-panel__collapsible"
          accordion
        >
          <CollapsibleItem
            expanded={false}
            header="Заготовленные отчеты"
            node="div"
            className="report-panel__collapsible-item report-panel__collapsible-item--prepared"
          >

            <div className="report-panel__wrapper">

              <Select
                id="report-area"
                className="report-panel__select"
                multiple={false}
                onChange={
                  e => setState({
                    ...state,
                    'areaPrepared': e.target.value
                  })
                }
                options={{
                  classes: '',
                  dropdownOptions: {
                    alignment: 'left',
                    autoTrigger: true,
                    closeOnClick: true,
                    constrainWidth: true,
                    coverTrigger: true,
                    hover: false,
                    inDuration: 150,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 250
                  }
                }}
                value=""
              >
                <option
                  disabled
                  value=""
                >
                  Выберите район
                </option>
                {
                  props.area.map((el, i) => (
                    <option
                      key={i}
                      value={el.id}
                    >
                      {el.district_name}
                    </option>
                  ))
                }
              </Select>

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                columns={[
                  'name',
                  'phone'
                ]}
                href="#report-modal"
                data-title="Отчет об укомплектованности мед. работниками"
              >
                Отчет об укомплектованности мед. работниками
              </Button>

              <Button
                node="button"
                waves="light"
                columns={[
                  'name',
                  'locality',
                  'address',
                  'phone',
                  'foundingYear',
                  'firstAid',
                  'emergencyAssistance'
                ]}
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                href="#report-modal"
                data-title="Отчет о мед. пунктах с возможностью оказания медицинской помощи"
              >
                Отчет о мед. пунктах с возможностью оказания мед. помощи
              </Button>

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                columns={[
                  'name',
                  'locality',
                  'address',
                  'phone',
                  'foundingYear',
                  'pharmacy'
                ]}
                href="#report-modal"
                data-title="Отчет о медицинских пунктах с аптеками"
              >
                Отчет о медицинских пунктах с аптеками
              </Button>

              <Button
                node="button"
                waves="light"
                className="report-panel__button modal-trigger"
                onClick={handlePreparedReportsButton}
                href="#report-modal"
                data-title="Отчёт о медицинских пунктах с просроченной реконструкцией"
                disabled
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
              setParams={setState}
              area={props.area}
              params={state}
              handleReportButton={handleReportButton}
              closeModal={props.closeModal}
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