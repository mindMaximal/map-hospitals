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

// /api/map/single
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      const id = req.body.id

      const connection = initializeConnection(configDB)

      const query = 'SELECT `medical_center`.`name`, `medical_center`.`street`, `medical_center`.`number_of_house`, `medical_center`.`phone`, `medical_center`.`latitude`, `medical_center`.`longitude`, `medical_center`.`pharmacy`, \n' +
        '`medical_center`.`founding_year`, `medical_center`.`availability_of_emergency_mediical_care`, `medical_center`.`access_to_primary_health_care` , `locality`.`name` AS `locality_name`, `district`.`name` AS `district_name`, `region`.`name` AS `region_name`  FROM `medical_center`\n' +
        '    JOIN `locality`\n' +
        '        ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        '    JOIN `district`\n' +
        '        ON `district`.`id` = `locality`.`id`\n' +
        '    JOIN `region`\n' +
        '        ON `region`.`id` = `district`.`region_id`\n' +
        '    WHERE `medical_center`.`id` = ' + id

      connection.query(query, (err, rows, fields) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json(rows[0])
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router