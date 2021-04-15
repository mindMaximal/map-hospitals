import React, {useState} from 'react'
import 'materialize-css';
import { Button, Card, Row, Col } from 'react-materialize';
import './Reports.scss'
import {ReportPanel} from "./ReportPanel";

export const Reports = (props) => {

  const [reportState, setReportState] = useState({
    show: false
  })

  const handleReportButton = (e) => {
    setReportState({...reportState, 'show': !reportState.show})
  }

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
        <ReportPanel />
        : null
      }
    </div>
  )
}