import React from 'react'
import './ReportPanel.scss'
import {Select, Button, Checkbox, TextInput} from "react-materialize";

export const ReportPanel = (props) => {
  return (
    <div className="report-panel shadow">

      <div className="report-panel__wrapper">

        <div className="report-panel__title">
          Заготовленные отчеты
        </div>

        <Select
          id="report-area"
          className="report-panel__select"
          multiple={false}
          onChange={function noRefCheck(){}}
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
          <option value="1">
            Область 1
          </option>
          <option value="2">
            Область 2
          </option>
          <option value="3">
            Область 3
          </option>
        </Select>

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

      <div className="report-panel__wrapper">

        <div className="report-panel__title">
          Конструктор отчетов
        </div>

        <Select
          id="report-area"
          className="report-panel__select"
          multiple={false}
          onChange={function noRefCheck(){}}
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
        <option value="1">
          Область 1
        </option>
        <option value="2">
          Область 2
        </option>
        <option value="3">
          Область 3
        </option>
      </Select>

        <div className="report-filter__block">
          <Checkbox
            filledIn
            id="report-filter__pharmacy"
            label="Аптека"
            value="pharmacy"
          />
        </div>

        <div className="report-filter__block">
          <Checkbox
            filledIn
            id="report-filter__first-aid"
            label="Первая помощь"
            value="first-aid"
          />
        </div>

        <div className="report-filter__block">
          <Checkbox
            filledIn
            id="report-filter__emergency-assistance"
            label="Экстренная помощь"
            value="emergency-assistance"
          />
        </div>

        <div className="report-filter__block">
          <Checkbox
            filledIn
            id="report-filter__staffing"
            label="Укомплектованность фельдшерами"
            value="staffing"
          />
        </div>

        <div className="report-filter__block">
          <TextInput
            id="report-filter__year-foundation"
            type="number"
            s
            label="Год основания"
          />
        </div>

      </div>

      <div className="report-panel__controls">

        <Button
          node="button"
          small
          waves="light"
        >
          Сформировать отчет
        </Button>

      </div>

    </div>
  )
}