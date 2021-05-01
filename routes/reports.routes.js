const {Router} = require('express')
const config = require('config')
const {initializeConnection} = require("../functions/initializeConnection")
const {getAddress} = require("../functions/getAddress")
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

      console.log(req.body)

      const connection = initializeConnection(configDB)
      const haveAddress = req.body.columns.length === 0 ? true : req.body.columns.includes('address')
      const limiters = []
      const headersQuery = []
      let columns = ''

      const mappings = [
        {
          columnName: 'Название',
          queryName: 'name_Med_punkt',
          fieldName: 'name'
        },
        {
          columnName: 'Тип',
          queryName: 'type_Med_punkt',
          fieldName: 'type'
        },
        {
          columnName: 'Номер телефона',
          queryName: 'Phone_number',
          fieldName: 'phone'
        },
        {
          columnName: 'Аптека',
          queryName: 'Pharmacy',
          fieldName: 'pharmacy'
        },
        {
          columnName: 'Год основания',
          queryName: 'Founding_year',
          fieldName: 'foundingYear'
        },
        {
          columnName: 'Экстренная помощь',
          queryName: 'Availability_of_emergency_mediical_care',
          fieldName: 'emergencyAssistance'
        },
        {
          columnName: 'Первая помощь',
          queryName: 'Access_to_primary_health_care',
          fieldName: 'firstAid'
        },
        {
          columnName: 'Адрес',
          queryName: [
            'name_obl',
            'name_rayon',
            'name_nas_punkt',
            'Street',
            'Number_of_house'
          ],
          fieldName: 'address'
        },
        {
          columnName: 'Адрес',
          queryName: 'address',
          fieldName: 'address_'
        }
      ]

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

      /*for (const param of Object.keys(req.body.params)) {

        if (param === 'foundationYearFrom' && req.body.foundationYearFrom !== null) {
          limiters.push('`Founding_year` > ' + req.body.foundationYearFrom)
        } else if (param === 'foundationYearTo' && req.body.foundationYearTo !== null) {
          limiters.push('`Founding_year` < ' + req.body.foundationYearTo)
        } else if (param === 'pharmacy' && req.body.pharmacy === true) {
          limiters.push('`Pharmacy` = 1')
        } else if (param === 'firstAid' && req.body.firstAid === true) {
          limiters.push('`Access_to_primary_health_care` = 1')
        } else if (param === 'emergencyAssistance' && req.body.emergencyAssistance === true) {
          limiters.push('`Availability_of_emergency_mediical_care` = 1')
        }
      }*/

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
        query += '\n WHERE'

        for (let i = 0; i < limiters.length; i++) {
          if (i === limiters.length - 1) {
            query += '`' + limiters[i] + '`'
          } else {
            query += '`' + limiters[i] + '`' + ' AND '
          }
        }
      }

      console.log(query)

      connection.query(query, (err, rows, fields) => {
        if (err) {
          throw err
        }

        if (haveAddress) {

          for (const row of rows) {
            row.address = getAddress(row)

            delete row.name_nas_punkt
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

module.exports = router