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
  charset: 'utf8',
}

const updateRatesInDataBase = (connection, id) => {
  let query = 'SELECT `medical_center`.`id`, `staff`.`rate_full`, `staff`.`rate_occupied` FROM `medical_center`\n' +
      'LEFT JOIN `staff`\n' +
      ' ON `medical_center`.`id` = `staff`.`medical_center_id`\n' +
      'WHERE `medical_center`.`id` = 125'

  connection.query(query, (e, rows) => {
    if (e) {
      throw e
    }

    let rateFullSum = 0
    let rateOccupiedSum = 0

    for (const row of rows) {
      rateFullSum += row.rate_full
      rateOccupiedSum += row.rate_occupied
    }

    const staffing = Math.floor(rateOccupiedSum / rateFullSum * 100) / 100

    query = 'UPDATE `medical_center` SET `staffing` = ' + staffing + ' WHERE `medical_center`.`id` = ' + id

    connection.query(query, (err) => {
      if (err) {
        throw err
      }

      connection.end()

      return true
    })
  })
}

// /api/edit/rate/add
router.post(
  '/rate/add',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

      let date = new Date()
      date = date.getFullYear() + '-' + (date.getMonth() < 10? '0' + date.getMonth() : date.getMonth()) + '-' + date.getDate()

      const query = "INSERT INTO `staff` (`id`, `medical_center_id`, `date`, `position`, `rate_full`, `rate_occupied`) VALUES (?, ?, ?, ?, ?, ?)"

      connection.query(query, [null, req.body.medical_center_id, date, req.body.position, parseFloat(req.body.rate_full), parseFloat(req.body.rate_occupied)], (err) => {
        if (err) {
          throw err
        }

        updateRatesInDataBase(connection, req.body.medical_center_id)

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

// /api/edit/rate/update
router.post(
  '/rate/update',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

      let date = new Date()
      date = date.getFullYear() + '-' + (date.getMonth() < 10? '0' + date.getMonth() : date.getMonth()) + '-' + date.getDate()

      const query = "UPDATE `staff` SET `date` = ?, `position` = ?, `rate_full` = ?, `rate_occupied` = ? WHERE `staff`.`id` = ?"

      connection.query(query, [date, req.body.position, req.body.rate_full, req.body.rate_occupied, req.body.id], (err) => {

        if (err) {
          throw err
        }

        updateRatesInDataBase(connection, req.body.medical_center_id)

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

// /api/edit/rate/delete
router.post(
  '/rate/delete',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

      const query = "DELETE FROM `staff` WHERE `staff`.`id` = ?"

      connection.query(query, [req.body.id], (err) => {
        if (err) {
          throw err
        }

        updateRatesInDataBase(connection, req.body.medical_center_id)

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

export default router