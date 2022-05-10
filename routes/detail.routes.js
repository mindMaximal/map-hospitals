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

      console.log(req.params)

      if (req.params.id === undefined || req.params.id === null) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        return
      }

      const connection = initializeConnection(configDB)

      const query = 'SELECT `medical_center`.`name`, `medical_center`.`staffing`, `medical_center`.`type_id` , `medical_center`.`latitude`, `medical_center`.`longitude`, `medical_center`.`phone`, `medical_center`.`founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`, `pharmacy`, `locality`.`name` AS `locality_name`, `district`.`name` AS `district_name`, `region`.`name` AS `region_name`, `medical_center`.`street`, `medical_center`.`number_of_house`, `medical_center`.`id`, `region`.`id` AS `region_id`, `district`.`id` AS `district_id`, `locality`.`id` AS `locality_id`, `medical_facility`.`name` AS `facility_name`, `medical_facility_id`, `types`.`name` AS `type_name`, `medical_facility`.`name` AS `parent` FROM `medical_center`\n' +
        'LEFT JOIN `locality`\n' +
        '    ON `medical_center`.`locality_id` = `locality`.`id`\n' +
        'LEFT JOIN `district`\n' +
        '    ON `locality`.`district_id` = `district`.`id`\n' +
        'LEFT JOIN `region`\n' +
        '    ON `region`.`id` = `district`.`region_id`\n' +
        'LEFT JOIN `medical_facility`\n' +
        '    ON `medical_center`.`medical_facility_id` =  `medical_facility`.`id`\n' +
        'LEFT JOIN `types`\n' +
        '    ON `medical_center`.`type_id` = `types`.`id`\n' +
        'WHERE `medical_center`.`id` = ' + req.params.id

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

      const query = 'SELECT * FROM `photo` WHERE `medical_center_id` = ' + req.params.id + ' ORDER BY `photo`.`id` DESC'

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

// /api/rates/:id
router.get(
  '/rates/:id',
  [],
  async (req, res) => {
    try {
      if (req.params.id === undefined || req.params.id === null) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        return
      }

      const connection = initializeConnection(configDB)

      const query = 'SELECT * FROM `staff` WHERE `medical_center_id` = ' + req.params.id + ' ORDER BY `staff`.`date` DESC'

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

// api/detail/delete
router.post(
  '/delete',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = 'DELETE FROM `medical_center` WHERE `medical_center`.`id` = ' + req.body.id

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

// api/detail/update
router.post(
  '/update',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = "UPDATE `medical_center` SET `locality_id` = ?, `medical_facility_id` = ?, `type_id` = ?, `name` = ?, `street` = ?, `number_of_house` = ?, `phone` = ?, `latitude` = ?, `longitude` = ?, `pharmacy` = ?, `founding_year` = ?, `availability_of_emergency_mediical_care` = ?, `access_to_primary_health_care` = ?, `founding_year` = ? WHERE `medical_center`.`id` = ?"
      const data = [req.body.locality_id, req.body.medical_facility_id, req.body.type_id, req.body.name, req.body.street, req.body.number_of_house, req.body.phone, req.body.latitude, req.body.longitude, req.body.pharmacy, null, req.body.availability_of_emergency_mediical_care, req.body.access_to_primary_health_care, req.body.founding_year, req.body.id]

      connection.query(query, data, (err) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json({
          success: true
        })
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

// api/detail/add
router.post(
  '/add',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const query = "INSERT INTO `medical_center` (`id`, `locality_id`, `medical_facility_id`, `type_id`, `name`, `street`, `number_of_house`, `phone`, `latitude`, `longitude`, `pharmacy`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`, `staffing`) VALUES (?);"
      const data = [null, req.body.locality_id, req.body.medical_facility_id, req.body.type_id, req.body.name, req.body.street, req.body.number_of_house, req.body.phone, req.body.latitude, req.body.longitude, req.body.pharmacy,  req.body.founding_year, req.body.availability_of_emergency_mediical_care, req.body.access_to_primary_health_care, null]

      connection.query(query, [data], (err, rows) => {
        connection.end()

        console.log(rows)

        if (err) {
          throw err
        }

        res.json({
          success: true,
          id: rows.insertId
        })
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router