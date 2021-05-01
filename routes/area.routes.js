const mysql = require('mysql')
const {Router} = require('express')
const config = require('config')
const router = Router()
const {initializeConnection} = require('../functions/initializeConnection')

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/reports/area
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      console.log(req.body)

      const connection = initializeConnection(configDB)

      const query = 'SELECT * FROM `rayon`'

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

module.exports = router