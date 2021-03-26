import React, {useEffect, useState} from 'react'
import './SearchFilter.scss'
import {TextInput, Checkbox, CardPanel} from "react-materialize";

export const SearchFilter = (props) => {

  const [filters, setFilters] = useState({})

  const handleSearchFilterClick = e => {
    console.log(e)
    const el = e.target
    const value = e.target.value

    setFilters({
      ...filters,
     el
    })

  }

  useEffect(() => {

    console.log(filters)
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
            class="search-filter__checkbox"
            onClick={e => handleSearchFilterClick(e)}
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__first-aid"
            label="Первая помощь"
            class="search-filter__checkbox"
            value="first-aid"
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__emergency-assistance"
            label="Экстренная помощь"
            class="search-filter__checkbox"
            value="emergency-assistance"
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__staffing"
            label="Укомплектованность фельдшерами"
            class="search-filter__checkbox"
            value="staffing"
          />
        </div>

        <div className="search-filter__block">
          <TextInput
            id="search-filter__year-foundation"
            type="number"
            class="search-filter__textarea"
            label="Год основания"
          />
        </div>

      </div>
    </CardPanel>
  )
}