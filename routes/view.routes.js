import {Router} from 'express'
import config from 'config'
import {initializeConnection} from '../functions/initializeConnection.js'
import {normalizeData} from "../functions/normalizeData.js"
import mappings from "../mappings.js"

const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}


// /api/view/
router.post(
  '/',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

        const query = 'SELECT `medical_center`.`name`, `phone`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`, `pharmacy`, `locality`.`name` AS `locality_name`, `district`.`name` AS `district_name`, `region`.`name` AS `region_name`, `street`, `number_of_house`, `medical_center`.`id`  FROM `medical_center`\n' +
        '    JOIN `locality`\n' +
        '        ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        '    JOIN `district`\n' +
        '        ON `district`.`id` = `locality`.`id`\n' +
        '    JOIN `region`\n' +
        '        ON `region`.`id` = `district`.`region_id`'

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

        normalizeData(rows, true)

        const headers = []

        for (const key of Object.keys(rows[0])) {

          for (const mapping of mappings) {
            if (key === mapping.fullQueryName) {
              headers.push(mapping.columnName)
            }
          }
        }

        res.json({
          data: rows,
          headers
        })
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router