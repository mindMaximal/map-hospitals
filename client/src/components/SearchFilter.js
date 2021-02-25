import React from 'react'
import './SearchFilter.scss'
import {TextInput, Checkbox, CardPanel} from "react-materialize";

export const SearchFilter = (props) => {
  return (

    <CardPanel className="search-filter white">
      <div className="search-filter__wrapper">

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__pharmacy"
            label="Аптека"
            value="pharmacy"
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__first-aid"
            label="Первая помощь"
            value="first-aid"
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__emergency-assistance"
            label="Экстренная помощь"
            value="emergency-assistance"
          />
        </div>

        <div className="search-filter__block">
          <Checkbox
            filledIn
            id="search-filter__staffing"
            label="Укомплектованность фельдшерами"
            value="staffing"
          />
        </div>

        <div className="search-filter__block">
          <TextInput
            id="search-filter__year-foundation"
            type="number"
            label="Год основания"
          />
        </div>

      </div>
    </CardPanel>
  )
}