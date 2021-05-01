import React, {useCallback, useEffect, useState} from 'react'
import './SearchFilter.scss'
import {TextInput, Checkbox, CardPanel, Button} from "react-materialize";
import {useHttp} from "../hooks/http.hook";

export const SearchFilter = (props) => {
  const {loading, error, request, clearError} = useHttp()

  const [filters, setFilters] = useState({
    'pharmacy': null,
    'firstAid': null,
    'emergencyAssistance': null,
    'staffing': null,
    'foundationYearFrom': null,
    'foundationYearTo': null,
  })

  const handleCheckBoxFilterClick = (e) => {
    const { target } = e
    const { value, checked } = target

    setFilters({
      ...filters,
      [value]: checked ? true : null
    })

  }

  const handleTextareaBlur = (e) => {
    const { target } = e
    const { name, value } = target

    setFilters({
      ...filters,
      [name]: !isNaN(parseInt(value)) ? parseInt(value) : null
    })
  }

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async (body) => {
    try {
      const fetched = await request('/api/map/filter', 'POST', body)

      props.updateData(fetched.data, true)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchData(filters)
  }, [filters])

  return (

    <CardPanel className={'search-filter white ' + (props.visible ? 'search-filter--visible' : 'search-filter--hidden')}>
      <div className="search-filter__wrapper">

        <h4 className="search-filter__title">Фильтры:</h4>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            className="search-filter__checkbox"
            id="search-filter__pharmacy"
            label="Аптека"
            value="pharmacy"
            onClick={handleCheckBoxFilterClick}
          />
        </div>

        <input type="checkbox" className="search-filter__checkbox"/>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            className="search-filter__checkbox"
            id="search-filter__first-aid"
            label="Первая помощь"
            value="firstAid"
            checked={false}
            onClick={handleCheckBoxFilterClick}
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            className="search-filter__checkbox"
            id="search-filter__emergency-assistance"
            label="Экстренная помощь"
            value="emergencyAssistance"
            onClick={handleCheckBoxFilterClick}
          />
        </div>

        {/*<div className="search-filter__block">
          <Checkbox
            filledIn
            className"search-filter__checkbox
            id="search-filter__staffing"
            label="Укомплектованность фельдшерами"
            value="staffing"
            onClick={handleCheckBoxFilterClick}
          />
        </div>*/}

        <div className="search-filter__block">
          <TextInput
            id="search-filter__year-foundation-from"
            name="foundationYearFrom"
            className="search-filter__textarea"
            type="number"
            label="Год основания (от)"
            onBlur={handleTextareaBlur}
          />

          <TextInput
            id="search-filter__year-foundation-to"
            type="number"
            className="search-filter__textarea"
            name="foundationYearTo"
            label="Год основания (до)"
            onBlur={handleTextareaBlur}
          />
        </div>

      </div>
    </CardPanel>
  )
}