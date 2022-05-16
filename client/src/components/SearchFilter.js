import React, {useCallback, useEffect, useState} from 'react'
import './SearchFilter.scss'
import {TextInput, Checkbox, CardPanel} from "react-materialize"
import {useHttp} from "../hooks/http.hook"
import {SelectArea} from "./SelectArea"

export const SearchFilter = (props) => {
  const {loading, error, request, clearError} = useHttp()

  const [filters, setFilters] = useState({
    pharmacy: null,
    firstAid: null,
    emergencyAssistance: null,
    staffing: null,
    foundationYearFrom: null,
    foundationYearTo: null,
    district_id: null,
    type_id: null,
    population_id: null
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

  const handleSelectChange = (e) => {
    const { target } = e
    const { name } = target
    const value = parseInt(target.value)

    setFilters({
      ...filters,
      [name]: !isNaN(value) ? value !== 0 ? value : null : null
    })
  }

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchDataFilter = useCallback(async (body) => {
    try {

      if (props.source === 'table') {
        body = {
          ...body,
          source: 'table'
        }
      }

      const fetched = await request('/api/filter', 'POST', body)

      props.updateData(fetched.data, true)

    } catch (e) {}
  }, [request])

  useEffect(() => {
    fetchDataFilter(filters)
  }, [filters])

  return (

    <CardPanel className={`search-filter white ${props.className} ${(props.visible ? 'search-filter--visible' : 'search-filter--hidden')} ${props.style}`}>
      <div className="search-filter__wrapper">

        <h4 className="search-filter__title">Фильтры:</h4>

        <div className="search-filter__flex">

          <div className="search-filter__elem">

            <div className="search-filter__block search-filter__block--high">
              <SelectArea
                empty={true}
                name="district_id"
                onChange={handleSelectChange}
                disabled={loading}
                label="Район:"
                query="district"
              />
            </div>

            <div className="search-filter__block search-filter__block--high">
              <SelectArea
                empty={true}
                name="type_id"
                onChange={handleSelectChange}
                disabled={loading}
                label="Тип:"
                query="type"
              />
            </div>

            <div className="search-filter__block search-filter__block--high">
              <SelectArea
                empty={true}
                name="population_id"
                onChange={handleSelectChange}
                disabled={loading}
                label="Население:"
                query="population"
              />
            </div>

          </div>

          <div  className="search-filter__elem">

            <div className="search-filter__block search-filter__block--years">

              <TextInput
                id="search-filter__year-foundation-from search-filter__block--high"
                name="foundationYearFrom"
                className="search-filter__textarea"
                type="number"
                label="Год основания (от)"
                onBlur={handleTextareaBlur}
              />

              <TextInput
                id="search-filter__year-foundation-to"
                type="number"
                className="search-filter__textarea search-filter__block--high"
                name="foundationYearTo"
                label="Год основания (до)"
                onBlur={handleTextareaBlur}
              />

            </div>

          </div>

          <div className="search-filter__elem search-filter__elem--offset">

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

          </div>

        </div>

      </div>
    </CardPanel>
  )
}