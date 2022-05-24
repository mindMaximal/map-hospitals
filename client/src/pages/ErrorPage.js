import React from 'react'
import './ErrorPage.scss'
import {Button, Icon} from "react-materialize"
import {Link} from "react-router-dom"

export const ErrorPage = () => {

  return (
    <div className="error-page">

      <div className="container">

        <h1 className="error-page__title">
          <span>404</span>
          <Icon className="error-page__icon">sentiment_dissatisfied</Icon>
          Мы не нашли такую страницу ...
        </h1>

        <div className="error-page__buttons">

          <Link
            to="/"
            className="error-page__button"
          >
            <Button
              node="button"
              waves="light"
              className="blue darken-4"
            >
              Карта
            </Button>
          </Link>

          <Link
            to="/view"
            className="error-page__button"
          >
            <Button
              node="button"
              waves="light"
            >
              Таблица
            </Button>
          </Link>

        </div>

      </div>

    </div>
  )
}