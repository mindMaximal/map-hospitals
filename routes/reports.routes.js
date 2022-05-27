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
  database: config.get('database'),
  charset: 'utf8'
}

// /api/map/reports
router.post(
  '/',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

      console.log(req.body)

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
      }
      if (req.body.hasOwnProperty('foundationYearTo') && req.body.foundationYearTo !== null) {
        limiters.push('`founding_year` < ' + req.body.foundationYearTo)
      }
      if (req.body.hasOwnProperty('area') && req.body.area !== null) {
        limiters.push('`locality`.`district_id` = ' + req.body.area)
      }
      if (req.body.hasOwnProperty('type_id') && req.body.type_id !== null) {
        limiters.push('`medical_center`.`type_Id` = ' + req.body.type_id)
      }
      if (req.body.hasOwnProperty('population') && req.body.population !== null) {
        for (const populationEl of req.body.population.split('|')) {
          limiters.push('`population`.`population_adult` ' + populationEl)
        }
      }
      if (req.body.hasOwnProperty('staffing') && req.body.staffing !== null) {
        limiters.push('`medical_center`.`staffing` ' + req.body.staffing)
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
        columns = '`medical_center`.`name`, `founding_year`, `access_to_primary_health_care`, `availability_of_emergency_mediical_care`, `district`.`name` AS `district_name`, `locality`.`name` AS `locality_name`, `region`.`name` AS `region_name`, `street`, `number_of_house`'
      }

      let query = 'SELECT ' + columns + ' FROM `medical_center`\n' +
          'LEFT JOIN `locality`\n' +
          ' ON `medical_center`.`locality_id` = `locality`.`id`\n' +
          'LEFT JOIN `district`\n' +
          ' ON `locality`.`district_id` = `district`.`id`\n' +
          'LEFT JOIN `region`\n' +
          ' ON `district`.`region_id` = `region`.`id`\n' +
          'LEFT JOIN `types`\n' +
          ' ON `medical_center`.`type_id` = `types`.`id`\n' +
          'LEFT JOIN `population`\n' +
          ' ON `medical_center`.`locality_id` = `population`.`locality_id`'

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

      console.log(req.body)
      //console.log(query)

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

        for (const row of rows) {
          if (row.hasOwnProperty('staffing')) {
            row.staffing = Math.floor(parseFloat(row.staffing) * 100).toString() + '%'
          }
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

        const headers = ['№']

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