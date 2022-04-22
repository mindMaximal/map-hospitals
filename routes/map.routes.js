import {Router} from 'express'
import config from 'config'
import {initializeConnection} from '../functions/initializeConnection.js'

const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/map/
router.post(
  '/',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)
      const query = 'SELECT `medical_center`.`id`, `medical_center`.`name`, `medical_center`.`street`, `medical_center`.`number_of_house`, `medical_center`.`latitude`, `medical_center`.`longitude`, `locality`.`name` AS `locality_name`, `district`.`name` AS `district_name`, `region`.`name` AS `region_name`, `staffing` FROM `medical_center`\n' +
        '    LEFT JOIN `locality`\n' +
        '        ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        '    LEFT JOIN `district`\n' +
        '        ON `locality`.`district_id` = `district`.`id`\n' +
        '    LEFT JOIN `region`\n' +
        '        ON `region`.`id` = `district`.`region_id`'

      connection.query(query, (err, rows) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json({data: rows})
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

// /api/map/organizations
router.post(
  '/organizations',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)
      const query = 'SELECT `medical_facility`.`id`, `medical_facility`.`name`, `type_id`,  `latitude`, `longitude`, `locality_id`, `region`.`name`, `district`.`name`, `locality`.`name`, `street`, `number_of_house` FROM `medical_facility`\n' +
        'LEFT JOIN `locality`\n' +
        '    ON `medical_facility`.`locality_id` = `locality`.`id`\n' +
        'LEFT JOIN `district`\n' +
        '    ON `locality`.`district_id` = `district`.`id`\n' +
        'LEFT JOIN `region`\n' +
        '    ON `region`.`id` = `district`.`region_id`'

      connection.query(query, (err, rows) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json({data: rows})
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router

