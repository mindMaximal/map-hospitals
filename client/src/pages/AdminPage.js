import React, {useCallback, useEffect, useState, Component} from 'react'
import {useHttp} from "../hooks/http.hook"
import './AdminPage.scss'
import { Scrollbars } from 'react-custom-scrollbars'
import {Regions} from "../components/Regions";
import {Districts} from "../components/Districts";

export const AdminPage = () => {

  const {loading, error, request, clearError} = useHttp()

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/view', 'POST')

    } catch (e) {}
  }, [request])


  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="management">

      <CustomScrollbars>

        <div className="container management__container">

          <header className="management__header">

            <h1 className="management__title">
              Управление
            </h1>

          </header>

        </div>

        <div className="container management__container">

          <div className="management__wrapper">

            <div className="management__block">
              <Regions />
            </div>

            <div className="management__block">
              <Districts />
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