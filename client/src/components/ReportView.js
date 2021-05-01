import React from 'react'
import './ReportView.scss'
import {ProgressBar, Table, Modal, Button} from "react-materialize"

export const ReportView = (props) => {

  return (
    <Modal
      actions={[
        <Button
          node="button"
          waves="light"
          className="report-view__button--footer"
        >
          Сохранить в DOCX
        </Button>,
        <Button
          node="button"
          waves="light"
          className="report-view__button--footer"
        >
          Сохранить в PDF
        </Button>,
        <Button
          modal="close"
          node="button"
          waves="light"
          className="red darken-3 report-view__button--footer"
        >
          Закрыть
        </Button>
      ]}
      bottomSheet={false}
      fixedFooter
      id="report-modal"
      className="report-view__modal"
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

      <div>
        <h2 className="report-view__title">Отчет: {props.data && props.data.title}</h2>
      </div>

      { props.loading ? <ProgressBar /> :

        props.data.objects.length === 0 ? 'Элементов по данному запросов не найдено, пожалуйста, измените критерии поиска' :

        <Table>
          <thead>
          <tr>
            {props.data && props.data.headers.map((obj, i) => (
              <th
                key={i}
              >
                {obj}
              </th>
            ))}

          </tr>
          </thead>
          <tbody>
            {props.data && props.data.objects.map((obj, i) => (
              <tr
                key={i}
              >
                {Object.keys(obj).map((el, j) => (
                  <td
                    key={j}
                  >
                    {
                      obj[el] == null ? 'Отстуствует' :
                        obj[el] === 1 ? 'Есть' :
                          obj[el] === 0 ? 'Нет' :
                            obj[el]
                    }
                  </td>
                ))}

              </tr>
            ))}
          </tbody>
        </Table>

      }
    </Modal>
  )
}