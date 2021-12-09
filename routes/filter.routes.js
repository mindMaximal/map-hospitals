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

// /api/map/filter
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      const limiters = []

      for (const param of Object.keys(req.body)) {

        if (param === 'foundationYearFrom' && req.body.foundationYearFrom !== null) {
          limiters.push('`founding_year` > ' + req.body.foundationYearFrom)
        } else if (param === 'foundationYearTo' && req.body.foundationYearTo !== null) {
          limiters.push('`founding_year` < ' + req.body.foundationYearTo)
        } else if (param === 'pharmacy' && req.body.pharmacy === true) {
          limiters.push('`pharmacy` = 1')
        } else if (param === 'firstAid' && req.body.firstAid === true) {
          limiters.push('`access_to_primary_health_care` = 1')
        } else if (param === 'emergencyAssistance' && req.body.emergencyAssistance === true) {
          limiters.push('`availability_of_emergency_mediical_care` = 1')
        }
      }

      const connection = initializeConnection(configDB)

      let query = 'SELECT `medical_center`.`id`, `medical_center`.`name`, `medical_center`.`street`, `medical_center`.`number_of_house`, `medical_center`.`latitude`, `medical_center`.`longitude`, `locality`.`name` AS `locality_name`, `district`.`name` AS `district_name`, `region`.`name` AS `region_name`  FROM `medical_center`\n' +
        '    JOIN `locality`\n' +
        '        ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        '    JOIN `district`\n' +
        '        ON `district`.`id` = `locality`.`id`\n' +
        '    JOIN `region`\n' +
        '        ON `region`.`id` = `district`.`region_id`'

      if (limiters.length !== 0) {
        query += '\n WHERE'

        for (let i = 0; i < limiters.length; i++) {
          if (i === limiters.length - 1) {
            query += limiters[i]
          } else {
            query += limiters[i] + ' AND '
          }
        }
      }

      connection.query(query, (err, rows, fields) => {
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