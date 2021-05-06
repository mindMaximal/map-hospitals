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

// /api/map/single
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      console.log(req.body)

      const id = req.body.id

      const connection = initializeConnection(configDB)

      const query = 'SELECT * FROM `med_punkt`\n' +
        '    JOIN `nas_punkt`\n' +
        '        ON `med_punkt`.`nas_punkt_id_nas_punkt` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `rayon`\n' +
        '        ON `rayon`.`idrayon` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `obl`\n' +
        '        ON `obl`.`idObl` = `rayon`.`Obl_idObl`\n' +
        '    WHERE `id_Med_punkt` = ' + id

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

module.exports = router