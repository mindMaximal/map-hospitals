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

// /api/location/regions
router.post(
  '/regions',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `region`.`id`, `region`.`name`, COUNT(`district`.`id`) AS `districts_count` FROM `region`\n' +
        'LEFT JOIN `district` \n' +
        '\tON `region`.`id` = `district`.`region_id` \n' +
        'GROUP BY `region`.`id`\n' +
        'ORDER BY `region`.`name`'

      connection.query(query, (err, rows, fields) => {
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

// /api/location/districts
router.post(
  '/districts',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      let query

      if (req.body.id) {
        query = 'SELECT `district`.`id`, `district`.`name`, COUNT(`locality`.`id`) AS `localities_count` FROM `district`\n' +
          'LEFT JOIN `locality`\n' +
          '\tON `district`.`id` = `locality`.`district_id`\n' +
          'WHERE `district`.`region_id` = ' + req.body.id + '\n' +
          'GROUP BY `district`.`id`\n' +
          'ORDER BY `district`.`name`'
      } else {
        query = 'SELECT `district`.`id`, `district`.`name`, COUNT(`locality`.`id`) AS `localities_count` FROM `district`\n' +
          'LEFT JOIN `locality`\n' +
          '\tON `district`.`id` = `locality`.`district_id`\n' +
          'GROUP BY `district`.`id`\n' +
          'ORDER BY `district`.`name`'
      }

      connection.query(query, (err, rows, fields) => {
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

// /api/location/district
router.post(
  '/district',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `district`.`id`, `district`.`name`, COUNT(`locality`.`id`) AS `localities_count`, `region`.`id` AS `region_name` FROM `district`\n' +
        'LEFT JOIN `locality`\n' +
        '\tON `district`.`id` = `locality`.`district_id`\n' +
        'JOIN `region`\n' +
        '\tON `district`.`region_id` = `region`.`id`\n' +
        'WHERE `district`.`id` = ' + req.body.id + '\n' +
        'GROUP BY `district`.`id`\n' +
        'ORDER BY `district`.`name`'

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

/*

SELECT `region`.`id`, `region`.`name`, COUNT(`district`.`id`) AS `districts_count` FROM `region`
LEFT JOIN `district`
	ON `region`.`id` = `district`.`region_id`
GROUP BY `region`.`id`
ORDER BY `region`.`name`

SELECT `district`.`id`, `district`.`name`, COUNT(`locality`.`id`) AS `localities_count` FROM `district`
LEFT JOIN `locality`
	ON `district`.`id` = `locality`.`district_id`
GROUP BY `district`.`id`
ORDER BY `district`.`name`

SELECT `district`.`id`, `district`.`name`, COUNT(`locality`.`id`) AS `localities_count` FROM `district`
LEFT JOIN `locality`
	ON `district`.`id` = `locality`.`district_id`
WHERE `district`.`region_id` = 1
GROUP BY `district`.`id`
ORDER BY `district`.`name`

// Запрос на 1 район
SELECT `district`.`id`, `district`.`name`, COUNT(`locality`.`id`) AS `localities_count`, `region`.`name` AS `region_name` FROM `district`
LEFT JOIN `locality`
	ON `district`.`id` = `locality`.`district_id`
JOIN `region`
	ON `district`.`region_id` = `region`.`id`
WHERE `district`.`id` = 1
GROUP BY `district`.`id`
ORDER BY `district`.`name`

 */