import {Table} from "react-materialize"
import "./TableView.scss"
import React from "react"
import {Link} from "react-router-dom";

export const TableView = (props) => {

  const getContextMenu = (x, y, id) => {
    const el = document.querySelector('.context-menu')

    if (!el)
      return

    el.style = `top: ${y}px; left: ${x}px; display: flex;`

    document.addEventListener('click', (e) => {
      const { target } = e

      if (target !== el && !el.contains(target)) {
        el.style.display = 'none'
      }
    })

  }

  const handleTableContextMenu = (e, id) => {
    e.preventDefault()
    const { target, clientX, clientY } = e
    getContextMenu(clientX, clientY, target)
  }

  return (
    <Table className="table-view">

      <thead>
      <tr>
        { props.headers && props.headers.length > 0 && props.headers.map((obj, i) => {
          if (obj !== 'id') {
            return (
              <th
                key={i}
                className="table-view__header"
              >
                {obj}
              </th>
            )
          }
        })}

      </tr>
      </thead>
      <tbody>
      {props.data && props.data.length > 0 && props.data.map((obj, i) => (
        <tr
          key={i}
          className='table-view__row'
        >
          {Object.keys(obj).map((el, j) => (
            props.headers[j] === 'id' ? null :
              <td
                key={j}
                data-label={props.headers[j]}
                onContextMenu={(e) => handleTableContextMenu(e, obj.id)}
              >
                {
                  props.headers[j] === 'Название' ? <Link to={`/detail/${obj.id}`}>{obj[el]}</Link> : obj[el]
                }
              </td>
          ))}

        </tr>
      ))}
      </tbody>
    </Table>
  )
}