import {Router} from 'express'
import config from 'config'
import {initializeConnection} from "../functions/initializeConnection.js"
import {getAddress} from "../functions/getAddress.js"
import mappings from "../mappings.js"

const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/map/reports
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const haveAddress = req.body.columns.length === 0 ? true : req.body.columns.includes('address')
      const haveLocality = req.body.columns.length === 0 ? false : req.body.columns.includes('locality')

      const limiters = []
      const headersQuery = []
      let columns = ''

      for (const column of req.body.columns) {

        for (const mapping of mappings) {
          if (column === mapping.fieldName) {

            if (Array.isArray(mapping.queryName)) {
              for (const el of mapping.queryName) {
                headersQuery.push(el)
              }
            } else {
              headersQuery.push(mapping.queryName)
            }
          }
        }
      }

      for (const param of req.body.conditions) {
        for (const mapping of mappings) {
          if (param === mapping.fieldName) {
            limiters.push('`' + mapping.queryName + '`' + ' = 1')
          }
        }
      }

      if (req.body.hasOwnProperty('foundationYearFrom') && req.body.foundationYearFrom !== null) {
        limiters.push('`Founding_year` > ' + req.body.foundationYearFrom)
      } else if (req.body.hasOwnProperty('foundationYearTo') && req.body.foundationYearTo !== null) {
        limiters.push('`Founding_year` < ' + req.body.foundationYearTo)
      } else if (req.body.hasOwnProperty('area') && req.body.area !== null) {
        limiters.push('`idrayon` = ' + req.body.area)
      }

      if (headersQuery.length !== 0) {

        for (let i = 0; i < headersQuery.length; i++) {
          if (i === headersQuery.length - 1) {
            columns += '`' + headersQuery[i] + '`'
          } else {
            columns += '`' + headersQuery[i] + '`' + ', '
          }
        }
      } else {
        columns = '`name_Med_punkt`, `type_Med_punkt`, `Pharmacy`, `Founding_year`, `Access_to_primary_health_care`, `Availability_of_emergency_mediical_care`, `Phone_number`, `name_obl`, `name_rayon`, `name_nas_punkt`, `Street`, `Number_of_house`'
      }

      let query = 'SELECT ' + columns + ' FROM `med_punkt`\n' +
        '    JOIN `nas_punkt`\n' +
        '        ON `med_punkt`.`nas_punkt_id_nas_punkt` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `rayon`\n' +
        '        ON `rayon`.`idrayon` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `obl`\n' +
        '        ON `obl`.`idObl` = `rayon`.`Obl_idObl`'

      if (limiters.length !== 0) {
        query += '\n WHERE '

        for (let i = 0; i < limiters.length; i++) {
          if (i === limiters.length - 1) {
            query += limiters[i]
          } else {
            query += limiters[i] + ' AND '
          }
        }
      }

      connection.query(query, (err, rows) => {
        connection.end()

        if (err) {
          throw err
        }

        if (rows.length === 0) {
          res.json({
            objects: [],
            headers: []
          })

          return
        }

        if (haveAddress) {

          for (const row of rows) {
            row.address = getAddress(row)

            if (!haveLocality) {
              delete row.name_nas_punkt
            }

            delete row.name_obl
            delete row.name_rayon
            delete row.Number_of_house
            delete row.Street
          }
        }

        const headers = []

        for (const key of Object.keys(rows[0])) {

          for (const mapping of mappings) {
            if (key === mapping.queryName) {
              headers.push(mapping.columnName)
            }
          }
        }

        res.json({
          title: req.body.title ? req.body.title : null,
          headers,
          objects: rows
        })
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router