import {Router} from 'express'
import config from 'config'
import {initializeConnection} from '../functions/initializeConnection.js'

const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database'),
  charset: 'utf8'
}

// api/address/region
router.get(
  '/region',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `region`.`id`, `region`.`name` AS `region_name`  FROM `region` ORDER BY `region_name`'

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

      const query = 'SELECT `district`.`id`, `district`.`name` AS `district_name`  FROM `district` ORDER BY `district_name`'

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

      const query = 'SELECT `locality`.`id`, `locality`.`name` AS `locality_name`  FROM `locality` ORDER BY `locality_name`'

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

      const query = 'SELECT `medical_facility`.`id`, `medical_facility`.`name` AS `facility_name` FROM `medical_facility` ORDER BY `facility_name`'

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

// api/address/type
router.get(
  '/type',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'SELECT `types`.`id`, `types`.`name` AS `type_name` FROM `types`'

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

// api/address/population
router.get(
  '/population',
  [],
  async (req, res) => {
    try {

      res.json([
        {
          id: 1,
          population_name: 'Менее 100',
          text: 'Мобильные медицинские бригады, в т.ч. с исполь- зованием комплексов передвижных медицинских',
        },
        {
          id: 2,
          population_name: '100 - 300',
          text: 'ФАП/ФЗ, если рассто- яние до бли- жайшей МО превышает 6 км',
        },
        {
          id: 3,
          population_name: '301 - 1000',
          text: 'ФАП/ФЗ вне зависимости от расстоя- ния в случае отсутствия других меди- цинских орга- низаций',
        },
        {
          id: 4,
          population_name: '1001 - 2000',
          text: 'ФАП/ФЗ, если рас- стояние до ближайшей МО не превы- шает 6 км; Центры/от- деления ОВП или врачеб- ная амбула- тория, если расстояние до ближай- шей МО пре- вышает 6 км.',
        },
        {
          id: 5,
          population_name: 'Более 2000 ',
          text: 'Врачебные амбулатории вне зави- симости от расстояния до ближай- шей МО структурное подразделе- ние (отде- ления) МО, оказывающей ПМСП по террито- риально-у- частковому принципу',
        },
      ])

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router