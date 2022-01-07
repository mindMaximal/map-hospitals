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

// api/address/region
router.get(
  '/region',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `region`.`id`, `region`.`name` AS `region_name`  FROM `region`'

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

// api/address/district
router.get(
  '/district',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `district`.`id`, `district`.`name` AS `district_name`  FROM `district`'

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

// api/address/locality
router.get(
  '/locality',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `locality`.`id`, `locality`.`name` AS `locality_name`  FROM `locality`'

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

// api/address/facility
router.get(
  '/facility',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `medical_facility`.`id`, `medical_facility`.`name` AS `facility_name`  FROM `medical_facility`'

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