import React from 'react'
import './ReportPanel.scss'

export const ReportPanel = (props) => {
  return (
    <div className="report-panel shadow">

      <div className="report-panel__wrapper">

        <div className="report-panel__title">
          Заготовленные отчеты
        </div>

        <select name="area" id="area" className="report-panel__select">
          <option value="1">Области 1</option>
          <option value="2">Области 2</option>
          <option value="3">Области 3</option>
        </select>

        <button className="button report-panel__button">
          Отчет об укомплектованности мед. работниками
        </button>

        <button className="button report-panel__button">
          Отчет о ФАПах с возможностью оказания первой помощи
        </button>

        <button className="button report-panel__button">
          Отчет о ФАПах с аптеками
        </button>

      </div>

      <div className="report-panel__wrapper">

        <div className="report-panel__title">
          Конструктор отчетов
        </div>

        <select name="area" id="area" className="report-panel__select">
          <option value="#fix">Области 1</option>
          <option value="#fix">Области 2</option>
          <option value="#fix">Области 3</option>
        </select>

        <div className="report-panel__block">
          <input type="checkbox" className="report-panel__checkbox" value="#fix" id="pharmacy"/>
          <label className="report-panel__label" htmlFor="pharmacy">Аптека</label>
        </div>

        <div className="report-panel__block">
          <input type="checkbox" className="report-panel__checkbox" value="#fix" id="first-aid"/>
          <label className="report-panel__label" htmlFor="first-aid">Первая помощь</label>
        </div>

        <div className="report-panel__block">
          <input type="checkbox" className="report-panel__checkbox" value="#fix" id="emergency-assistance"/>
          <label className="report-panel__label" htmlFor="emergency-assistance">Экстренная помощь</label>
        </div>

        <div className="report-panel__block">
          <input type="checkbox" className="report-panel__checkbox" value="#fix" id="staffing"/>
          <label className="report-panel__label" htmlFor="staffing">Укомплектованность фельдшерами</label>
        </div>

        <div className="report-panel__block">
          <span>Год основания</span>
          <input type="number" className="report-panel__checkbox" value="#fix" id="year-foundation"/>
        </div>

      </div>

      <div className="report-panel__controls">

        <button className="shadow button report-panel__button">
          Сформировать отчет
        </button>

      </div>

    </div>
  )
}