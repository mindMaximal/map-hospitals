import React, {useCallback, useEffect, useState} from 'react'
import './ReportPanel.scss'
import {Select, Button, Checkbox, TextInput} from "react-materialize"
import {useHttp} from "../hooks/http.hook"

export const ReportBuilder = (props) => {

  const {loading, error, request, clearError} = useHttp()
  const [types, setTypes] = useState([])
  const [population, setPopulation] = useState([])
  const [staffing, setStaffing] = useState([])

  const handleTextareaBlur = (e) => {
    const { target } = e
    const { value, name } = target

    props.setParams({
      ...props.params,
      [name]: !isNaN(parseInt(value)) ? parseInt(value) : null
    })
  }

  useEffect(() => {
    console.log(error)
    clearError()
  }, [clearError, error])

  const fetchTypes = useCallback(async () => {
    try {
      const fetched = await request(`/api/address/type`, 'GET', null)

      setTypes(fetched)
    } catch (e) {}
  }, [request])

  const fetchStaffing = useCallback(async () => {
    try {
      const fetched = await request(`/api/address/staffing`, 'GET', null)

      setStaffing(fetched)
    } catch (e) {}
  }, [request])

  const fetchPopulation = useCallback(async () => {
    try {
      const fetched = await request(`/api/address/population`, 'GET', null)

      setPopulation(fetched)
    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchTypes()
    fetchPopulation()
    fetchStaffing()
  }, [fetchTypes])

  const handleReportParamClick = (e) => {
    const { target } = e
    const { value, checked } = target
    const { conditions } = props.params

    if (checked) {

      if (!conditions.includes(value)) {
        conditions.push(value)

        props.setParams({
          ...props.params,
          conditions
        })
      }
    } else {
      const index = conditions.indexOf(value)

      if (index > -1) {
        conditions.splice(index, 1)
      }
    }
  }

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

          <h4 className="report-panel__subtitle report-panel__subtitle--margin">
            Фильтры:
          </h4>

          <div className="report-panel__block flex flex--between report-panel__block--mobile-width">
            <div className="report-panel__block--half report-panel__block--wrap">
              <Select
                  id="report-area"
                  className="report-panel__select"
                  multiple={false}
                  onChange={
                    e => props.setParams({
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
                  value="0"
              >
                <option
                    disabled
                    value="0"
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
            </div>

            <div className="report-panel__block--half report-panel__block--wrap">
              <Select
                  id="report-population"
                  className="report-panel__select"
                  multiple={false}
                  onChange={
                    e => props.setParams({
                      ...props.params,
                      'staffing': e.target.value
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
                  value="-"
              >
                <option
                    disabled
                    value="-"
                >
                  Укомплектованность
                </option>
                {
                  staffing.map((el, i) => (
                      <option
                          key={i}
                          value={el.value}
                      >
                        {el.staffing_name}
                      </option>
                  ))
                }
              </Select>
            </div>

          </div>

          <div className="report-panel__block flex flex--between report-panel__block--mobile-width">
            <div className="report-panel__block--half report-panel__block--wrap">
              <Select
                  id="report-type"
                  className="report-panel__select"
                  multiple={false}
                  onChange={
                    e => props.setParams({
                      ...props.params,
                      'type_id': e.target.value
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
                  value="0"
              >
                <option
                    disabled
                    value="0"
                >
                  Выберите тип
                </option>
                {
                  types.map((el, i) => (
                      <option
                          key={i}
                          value={el.id}
                      >
                        {el.type_name}
                      </option>
                  ))
                }
              </Select>
            </div>

            <div className="report-panel__block--half report-panel__block--wrap">
              <Select
                  id="report-population"
                  className="report-panel__select"
                  multiple={false}
                  onChange={
                    e => props.setParams({
                      ...props.params,
                      'population': e.target.value
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
                  value="0"
              >
                <option
                    disabled
                    value="0"
                >
                  Выберите население
                </option>
                {
                  population.map((el, i) => (
                      <option
                          key={i}
                          value={el.value}
                      >
                        {el.population_name}
                      </option>
                  ))
                }
              </Select>
            </div>

          </div>

         <div className="report-panel__container report-panel__container--margin">

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               onClick={handleReportParamClick}
               id="report-panel__pharmacy"
               label="Аптека"
               value="pharmacy"
             />
           </div>

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               onClick={handleReportParamClick}
               id="report-panel__first-aid"
               label="Первая помощь"
               value="first-aid"
             />
           </div>

           <div className="report-panel__block report-panel__block--half">
             <Checkbox
               filledIn
               onClick={handleReportParamClick}
               id="report-panel__emergency-assistance"
               label="Экстренная помощь"
               value="emergency-assistance"
             />
           </div>

         </div>

          <div className="report-panel__block flex flex--between report-panel__block--mobile-width">
            <div className="report-panel__block--half report-panel__block--wrap">
              <TextInput
                id="report-panel__year-foundation-from"
                type="number"
                onBlur={handleTextareaBlur}
                name="foundationYearFrom"
                label="Год основания (от)"
              />
            </div>

            <div className="report-panel__block--half report-panel__block--wrap">
              <TextInput
                id="report-panel__year-foundation-to"
                type="number"
                onBlur={handleTextareaBlur}
                name="foundationYearTo"
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

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                filledIn
                id="report-columns-staffing"
                className="report-columns"
                onClick={handleCheckBoxClick}
                label="Укомплектованость"
                name="staffing"
              />
            </div>

            <div className="report-panel__block report-panel__block--half">
              <Checkbox
                  filledIn
                  id="report-columns-population"
                  className="report-columns"
                  onClick={handleCheckBoxClick}
                  label="Население"
                  name="population"f
              />
            </div>

          </div>

        </div>

        <div className="report-panel__controls">

        <Button
          node="button"
          waves="light"
          className="modal-trigger report-panel__control"
          href="#report-modal"
          onClick={props.handleReportButton}
        >
          Сформировать отчет
        </Button>

        <Button
          node="button"
          waves="light"
          className="red darken-3 report-panel__control report-panel__button--close"
          onClick={props.closeModal}
        >
          Закрыть
        </Button>

      </div>

    </div>
  )
}