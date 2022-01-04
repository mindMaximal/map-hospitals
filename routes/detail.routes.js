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


// /api/detail/:id
router.get(
  '/:id',
  [],
  async (req, res) => {
    try {

      if (req.params.id === undefined || req.params.id === null) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        return
      }

      const connection = initializeConnection(configDB)

      const query = 'SELECT `medical_center`.`name`, `medical_center`.`latitude`, `medical_center`.`longitude`, `phone`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`, `pharmacy`, `locality`.`name` AS `locality_name`, `district`.`name` AS `district_name`, `region`.`name` AS `region_name`, `street`, `number_of_house`, `medical_center`.`id`  FROM `medical_center`\n' +
        '    JOIN `locality`\n' +
        '        ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        '    JOIN `district`\n' +
        '        ON `locality`.`district_id` = `district`.`id`\n' +
        '    JOIN `region`\n' +
        '        ON `region`.`id` = `district`.`region_id`' +
        '    WHERE `medical_center`.`id` = ' + req.params.id

      connection.query(query, (err, rows) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json(rows)
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

// /api/images/:id
router.get(
  '/images/:id',
  [],
  async (req, res) => {
    try {
      if (req.params.id === undefined || req.params.id === null) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        return
      }

      const connection = initializeConnection(configDB)

      const query = 'SELECT * FROM `photo` WHERE `medical_center_id` = ' + req.params.id

      connection.query(query, (err, rows) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json(rows)
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)


export default router