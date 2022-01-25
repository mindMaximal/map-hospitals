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

            if (Array.isArray(mapping.fullQueryName)) {
              for (const el of mapping.fullQueryName) {
                headersQuery.push(el)
              }
            } else {
              headersQuery.push(mapping.fullQueryName)
            }
          }
        }
      }

      for (const param of req.body.conditions) {
        for (const mapping of mappings) {
          if (param === mapping.fieldName) {
            limiters.push('`' + mapping.fullQueryName + '`' + ' = 1')
          }
        }
      }

      if (req.body.hasOwnProperty('foundationYearFrom') && req.body.foundationYearFrom !== null) {
        limiters.push('`founding_year` > ' + req.body.foundationYearFrom)
      } else if (req.body.hasOwnProperty('foundationYearTo') && req.body.foundationYearTo !== null) {
        limiters.push('`founding_year` < ' + req.body.foundationYearTo)
      } else if (req.body.hasOwnProperty('area') && req.body.area !== null) {
        limiters.push('`locality`.`district_id` = ' + req.body.area)
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
        columns = '`medical_center`.`name`, `type_id`, `pharmacy`, `founding_year`, `access_to_primary_health_care`, `availability_of_emergency_mediical_care`, `phone`, `district`.`name` AS `district_name`, `locality`.`name` AS `locality_name`, `region`.`name` AS `region_name`, `street`, `number_of_house`'
      }

      let query = 'SELECT ' + columns + ' FROM `medical_center`\n' +
        '    LEFT JOIN `locality`\n' +
        '        ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        '    LEFT JOIN `district`\n' +
        '        ON `locality`.`district_id` = `district`.`id`\n' +
        '    LEFT JOIN `region`\n' +
        '        ON `district`.`region_id` = `region`.`id`'

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

      console.log(query)

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
              delete row.locality_name
            }

            delete row.region_name
            delete row.district_name
            delete row.number_of_house
            delete row.street
          }
        }

        const headers = []

        for (const key of Object.keys(rows[0])) {

          for (const mapping of mappings) {
            if (key === mapping.queryName || key === mapping.fullQueryName) {
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