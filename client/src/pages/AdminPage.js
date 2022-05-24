import React, {useCallback, useEffect, Component} from 'react'
import {useHttp} from "../hooks/http.hook"
import './AdminPage.scss'
import { Scrollbars } from 'react-custom-scrollbars'
import {Location} from "../components/AdminPageComponents/Location"
import {Button} from "react-materialize"
import {Link} from "react-router-dom"

export const AdminPage = () => {

  return (
    <div className="management">

      <CustomScrollbars>

        <div className="container management__container">

          <header className="management__header">

            <h1 className="management__title">
              Управление
            </h1>

            <div className="management__nav">

              <Link to="/">
                <Button
                  node="button"
                  className="blue darken-4"
                  style={{
                    marginRight: '5px'
                  }}
                  waves="light"
                >
                  Карта
                </Button>
              </Link>

              <Link to="/view">
                <Button
                  node="button"
                  waves="light"
                  className="blue darken-4"
                >
                  Таблица
                </Button>
              </Link>

            </div>

          </header>

        </div>

        <div className="container management__container">

          <div className="management__wrapper">

            <div className="management__block">
              <Location
                title="Населенные пункты"
                parent="район"
                queries="localities"
                parentQueries="districts"
                label="Население"
                labelQuery="population"
                query="locality"
                parentQuery="district"
                name="населенный пункт"
              />
            </div>

            <div className="management__block">
              <Location
                title="Районы"
                parent="регион"
                queries="districts"
                parentQueries="regions"
                label="Населенные пункты, шт"
                labelQuery="localities_count"
                query="district"
                parentQuery="region"
                name="район"
              />
            </div>

            <div className="management__block">
              <Location
                title="Регионы"
                queries="regions"
                label="Районы, шт"
                labelQuery="districts_count"
                query="region"
                name="регион"
              />
            </div>

          </div>

        </div>

      </CustomScrollbars>

    </div>
  )
}

class CustomScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        renderView={props => <div {...props} className="management__scroll-view"/>}>
        {this.props.children}
      </Scrollbars>
    );
  }
}