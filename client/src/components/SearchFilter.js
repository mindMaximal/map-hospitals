import React, {useCallback, useEffect, useState} from 'react'
import './SearchFilter.scss'
import {TextInput, Checkbox, CardPanel} from "react-materialize";
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

  const handleCheckBoxFilterClick = e => {
    const el = e.target
    const value = e.target.value

    setFilters({
      ...filters,
      [value]: el.checked ? true : null
    })

  }

  const handleTextareaBlur = e => {
    const el = e.target
    const name = e.target.name

    setFilters({
      ...filters,
      [name]: !isNaN(parseInt(el.value)) ? parseInt(el.value) : null
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
      console.log(fetched)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    console.log('Отправлено', filters)
    fetchData(filters)
  }, [filters])

  return (

    <CardPanel className="search-filter white">
      <div className="search-filter__wrapper">

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__pharmacy"
            label="Аптека"
            value="pharmacy"
            onClick={e => handleCheckBoxFilterClick(e)}
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__first-aid"
            label="Первая помощь"
            value="firstAid"
            onClick={e => handleCheckBoxFilterClick(e)}
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__emergency-assistance"
            label="Экстренная помощь"
            value="emergencyAssistance"
            onClick={e => handleCheckBoxFilterClick(e)}
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__staffing"
            label="Укомплектованность фельдшерами"
            value="staffing"
            onClick={e => handleCheckBoxFilterClick(e)}
          />
        </div>

        <div className="search-filter__block">
          <TextInput
            id="search-filter__year-foundation-from"
            name="foundationYearFrom"
            type="number"
            label="Год основания (от)"
            onBlur={e => handleTextareaBlur(e)}
          />

          <TextInput
            id="search-filter__year-foundation-to"
            type="number"
            name="foundationYearTo"
            label="Год основания (до)"
            onBlur={e => handleTextareaBlur(e)}
          />
        </div>

      </div>
    </CardPanel>
  )
}