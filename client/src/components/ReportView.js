import React, {useCallback, useEffect} from 'react'
import './ReportView.scss'
import {ProgressBar, Table, Modal, Button, Preloader} from "react-materialize"
import {useArrayBuffer} from "../hooks/arrayBuffer.hook"

export const ReportView = (props) => {

  const {loading, error, request, clearError} = useArrayBuffer()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      const fetched = await request('/api/reports/pdf', 'POST', body)

      const a = window.document.createElement("a");
      a.href = fetched
      a.download = `report.${new Date().toLocaleDateString()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (e) {}
  })

  const handleWordSaveClick = () => {
    fetchDataWord(props.data)
  }

  const fetchDataWord = useCallback(async (body) => {
    try {
      const fetched = await request('/api/reports/word', 'POST', body)

      const a = window.document.createElement("a");
      a.href = fetched
      a.download = `report.${new Date().toLocaleDateString()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (e) {}
  })

  const handlePdfSaveClick = () => {
    fetchData(props.data)
  }

  return (
    <Modal
      actions={[
        <Button
          node="button"
          waves="light"
          className="report-view__button--footer"
          onClick={handleWordSaveClick}
        >
          Сохранить в DOCX
        </Button>,
        <Button
          node="button"
          waves="light"
          className="report-view__button--footer"
          onClick={handlePdfSaveClick}
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
        <h2 className="report-view__title">{props.data && props.data.title ? props.data.title : 'Отчет'}</h2>
      </div>

      <div className="report-view__wrapper">

        { props.loading ? <ProgressBar /> :

          props.data.objects.length === 0 ?
            <div className="report-view__empty">

              <div className="report-view__empty--size">
                <img src="/search.png" alt="Not found"/>
              </div>

              <p>Элементов по данному запросов <b>не найдено.</b></p>
              <p>Измените критерии поиска</p>
            </div>
            :
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
                    <td>{i + 1}</td>
                    {Object.keys(obj).map((el, j) => (
                      <td
                        key={j}
                        data-label={props.data.headers[j+1]}
                      >
                        {
                          props.data.headers[j].toLowerCase() === 'население' ? obj[el] :
                            obj[el] === null ? '-' :
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

      </div>

      {
        loading &&
        <div className="report-view__loader">
          <Preloader
            active
            color="blue"
            flashing={false}
            size="big"
          />
          <div className="report-view__loader-message">Отчет формируется ...</div>
        </div>
      }
    </Modal>
  )
}