import React, {useCallback, useEffect, useState, Component} from 'react'
import {useHttp} from "../hooks/http.hook"
import './ViewPage.scss'
import {PageHeader} from "../components/PageHeader"
import {TableView} from "../components/TableView"
import {ContextMenu} from "../components/ContextMenu"
import {ProgressBar} from "react-materialize"
import { Scrollbars } from 'react-custom-scrollbars'

export const ViewPage = () => {

  const {loading, error, request, clearError} = useHttp()

  const [state, setState] = useState({
    modified: [],
    default: []
  })

  const [headers, setHeaders] = useState([])

  const [search, setSearch] = useState(null)

  useEffect(() => {
    if (error) {
      console.log('Ошибка: ' + error)
    }
    clearError()
  }, [clearError, error])

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/view', 'POST')

      setState({
        ...state,
        modified: fetched.data,
        default: fetched.data
      })

      setHeaders(fetched.headers)

    } catch (e) {}
  }, [request])

  const updateData = (value, force = false) => {

    setState({
      ...state,
      default: force ? value : state.default,
      modified: value})
  }

  const handleInputSearch = (e) => {
    setSearch(e.target.value.trim().toLowerCase())
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (search && search.length > 0) {

      updateData(state.default.filter((obj) => {
        return obj.name.toLowerCase().indexOf(search) !== -1;
      }))

    } else {

      updateData(
        state.default
      )

    }
  }, [search])

  return (
    <div className="view">

      <CustomScrollbars>

        <div className="container view__container">

          <PageHeader
            className="view__header"
            handleSearch={handleInputSearch}
            updateData={updateData}
          />

        </div>

        <div className="container table-container">

          {
            loading ? <ProgressBar/> :
              state.modified.length === 0 ? 'Элементов не найдено, пожалуйста, измените критерии поиска' :
                <TableView
                  data={state.modified}
                  headers={headers}
                />

          }
          <ContextMenu />

        </div>

      </CustomScrollbars>

    </div>
  )
}

class CustomScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        renderView={props => <div {...props} className="view__scroll-view"/>}>
        {this.props.children}
      </Scrollbars>
    );
  }
}