import {Button, TextInput} from "react-materialize"
import magnifer from "../img/magnifier.svg"
import {ReactComponent as Filter} from "../img/filter.svg"
import {SearchFilter} from "./SearchFilter"
import React from "react"
import './PageHeader.scss'


export const PageHeader = (props) => {

  return (
    <header className={'page-header ' + props.className}>

      <h1 className="page-header__title">
        Медицинские пункты
      </h1>

      <h4 className="page-header__subtitle">
        Подробная информация о мед. пунктанх, инфографика и формирование отчетов
      </h4>

      <div className="page-header__controls">

        <Button
          node="button"
          waves="light"
          className="page-header__control"
        >
          Изменение населения
        </Button>

        <Button
          node="button"
          waves="light"
          className="page-header__control"
        >
          Реконструкции
        </Button>

        <Button
          node="button"
          waves="light"
          className="page-header__control"
        >
          Укомплектованность
        </Button>

        <Button
          node="button"
          waves="light"
          className="page-header__control"
        >
          Отчеты
        </Button>

      </div>

      <div className="search">

        <div className="page-header__search">

          <TextInput
            id="view-search__input"
            inputClassName="view__text-input"
            label="Поиск мед. пунктов"
            onChange={null}
          />

        </div>

        <div className="search__controls">

          <button
            className="search__button search__button--search"
          >
            <img src={magnifer} alt="Поиск"/>
          </button>

          <button
            className="search__button search__button--filter"
            onClick={null}
          >
            <Filter />
          </button>
        </div>

        <SearchFilter
          className="page-header__search-filter"
          updateData={null}
          visible={null}
        />

      </div>

    </header>
  )

}