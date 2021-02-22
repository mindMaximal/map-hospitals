import React from 'react'
import './Reports.scss'
import {ReportPanel} from "./ReportPanel";

export const Reports = (props) => {
  return (
    <div className="reports">

      <div className="reports__controls">

        <button className="reports__button shadow">
          Отчеты
        </button>

        <button className="reports__button shadow">
          Отчеты по запросу
        </button>

      </div>

      <ReportPanel />

    </div>
  )
}