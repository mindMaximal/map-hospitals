import React, {useCallback, useEffect, useState} from 'react'
import './ReportPanel.scss'
import {ProgressBar, Modal, CollapsibleItem, Collapsible, Select, Button, Checkbox, TextInput} from "react-materialize";
import {useHttp} from "../hooks/http.hook";

export const ReportPanel = (props) => {

  const [state, setState] = useState(null)

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

    } catch (e) {}
  }, [request])

  const handleReportButton = e => {
    const parent = e.target.closest('.report-panel__collapsible-item')

    fetchData(state)
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
                small
                waves="light"
                className="report-panel__button"
              >
                Отчет об укомплектованности мед. работниками
              </Button>

              <Button
                node="button"
                small
                waves="light"
                className="report-panel__button"
              >
                Отчет о ФАПах с возможностью оказания первой помощи
              </Button>

              <Button
                node="button"
                small
                waves="light"
                className="report-panel__button"
              >
                Отчет о ФАПах с аптеками
              </Button>

            </div>

          </CollapsibleItem>

          <CollapsibleItem
            expanded
            header="Конструктор отчетов"
            node="div"
            className="report-panel__collapsible-item"
          >

            <div className="report-panel__wrapper">

              <Select
                id="report-area"
                className="report-panel__select"
                multiple={false}
                onChange={
                  e => setState({
                    ...state,
                    'area': e.target.value
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
                  Выберите область
                </option>
                <option value="11">
                  Область 1
                </option>
                <option value="2">
                  Область 2
                </option>
                <option value="3">
                  Область 3
                </option>
              </Select>

              <div className="report-panel__block">
                <Checkbox
                  filledIn
                  id="report-panel__pharmacy"
                  label="Аптека"
                  value="pharmacy"
                />
              </div>

              <div className="report-panel__block">
                <Checkbox
                  filledIn
                  id="report-panel__first-aid"
                  label="Первая помощь"
                  value="first-aid"
                />
              </div>

              <div className="report-panel__block">
                <Checkbox
                  filledIn
                  id="report-panel__emergency-assistance"
                  label="Экстренная помощь"
                  value="emergency-assistance"
                />
              </div>

              <div className="report-panel__block">
                <Checkbox
                  filledIn
                  id="report-panel__staffing"
                  label="Укомплектованность фельдшерами"
                  value="staffing"
                />
              </div>

              <div className="report-panel__block flex flex--between">
                <div className="report-panel__block--half">
                  <TextInput
                    id="report-panel__year-foundation-from"
                    type="number"
                    s
                    label="Год основания (от)"
                  />
                </div>

                <div className="report-panel__block--half">
                  <TextInput
                    id="report-panel__year-foundation-to"
                    type="number"
                    s
                    label="Год основания (до)"
                  />
                </div>
              </div>

            </div>

            <div className="report-panel__controls">

              <Button
                node="button"
                small
                waves="light"
                className="modal-trigger"
                href="#report-modal"
                onClick={handleReportButton}
              >
                Сформировать отчет
              </Button>

            </div>

          </CollapsibleItem>

        </Collapsible>

      </div>

      <Modal
        actions={[
          <Button flat modal="close" node="button" waves="green">Закрыть</Button>
        ]}
        bottomSheet={false}
        fixedFooter={false}
        id="report-modal"
        open={false}
        options={{
          dismissible: true,
          endingTop: '10%',
          inDuration: 250,
          onCloseEnd: null,
          onCloseStart: null,
          onOpenEnd: null,
          onOpenStart: null,
          opacity: 0.5,
          outDuration: 250,
          preventScrolling: true,
          startingTop: '4%'
        }}
      >
        { loading ?
          <ProgressBar /> : 'Данные загружены'}
      </Modal>

    </div>
  )
}