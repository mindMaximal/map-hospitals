import React from 'react'
import './ReportPanel.scss'
import {Select, Button, Checkbox, TextInput} from "react-materialize"

export const ReportBuilder= (props) => {

  return (
      <div className="report-builder report-panel__builder">

        <div className="report-panel__wrapper">

          <Select
            id="report-area"
            className="report-panel__select"
            multiple={false}
            onChange={
              e => props.setParam({
                ...props.params,
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
          waves="light"
          className="modal-trigger"
          href="#report-modal"
          onClick={props.handleReportButton}
        >
          Сформировать отчет
        </Button>

      </div>

    </div>
  )
}