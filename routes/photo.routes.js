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

// /api/map/single/photo
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      console.log(req.body)

      const id = req.body.id

      const connection = initializeConnection(configDB)

      const query = 'SELECT `name` FROM `photo` WHERE\n' +
        '\t`photo_id_med_punkt` = ' + id

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

module.exports = router