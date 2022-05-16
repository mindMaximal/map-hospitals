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

// /api/edit/rate/delete
router.post(
  '/rate/delete',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

      const query = "DELETE FROM `staff` WHERE `staff`.`id` = ?"

      connection.query(query, [req.body.id], (err) => {
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

export default router