import React from 'react'
import './ReportPanel.scss'
import {Select, Button, Checkbox, TextInput} from "react-materialize"

export const ReportBuilder= (props) => {

  const handleCheckBoxClick = (e) => {
    const { target } = e
    const { name, checked } = target
    const { columns } = props.params

    if (checked) {

      if (!columns.includes(name)) {
        columns.push(name)

        props.setParams({
          ...props.params,
          columns
        })
      }
    } else {
      const index = columns.indexOf(name)

      if (index > -1) {
        columns.splice(index, 1)
      }
    }
  }

  return (
      <div className="report-builder report-panel__builder">

        <div className="report-panel__wrapper">

          <h4 className="report-panel__subtitle">
            Фильтры:
          </h4>

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
              Выберите район
            </option>
            {
              props.area.map((el, i) => (
                <option
                  key={i}
                  value={el.idrayon}
                >
                  {el.name_rayon}
                </option>
              ))
            }
          </Select>

         <div className="report-panel__container">

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               id="report-panel__pharmacy"
               label="Аптека"
               value="pharmacy"
             />
           </div>

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               id="report-panel__first-aid"
               label="Первая помощь"
               value="first-aid"
             />
           </div>

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               id="report-panel__emergency-assistance"
               label="Экстренная помощь"
               value="emergency-assistance"
             />
           </div>

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               id="report-panel__staffing"
               label="Укомплектованность фельдшерами"
               value="staffing"
             />
           </div>

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

        <div className="report-panel__wrapper">

          <h4 className="report-panel__subtitle">
            Поля:
          </h4>

          <div className="report-panel__container">

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-name"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Название"
                name="name"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-address"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Адрес"
                name="address"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-type"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Тип"
                name="type"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-phone"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Телефон"
                name="phone"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-pharmacy"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Аптека"
                name="pharmacy"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-emergency-assistance"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Экстренная помощь"
                name="emergencyAssistance"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-emergency-first-aid"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Первая помощь"
                name="firstAid"
              />
            </div>


            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-emergency-founding-year"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Год основания"
                name="foundingYear"
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