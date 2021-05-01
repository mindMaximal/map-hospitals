const mysql = require('mysql')
const {Router} = require('express')
const config = require('config')
const {initializeConnection} = require('../functions/initializeConnection')
const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/map/
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      console.log(req.body)

      const connection = initializeConnection(configDB)

      const query = 'SELECT `id_Med_punkt`, `name_Med_punkt`, `Street`, `Number_of_house`, `latitude`, `longitude`, `name_nas_punkt`, `name_rayon`, `name_obl`  FROM `med_punkt`\n' +
        '    JOIN `nas_punkt`\n' +
        '        ON `med_punkt`.`nas_punkt_id_nas_punkt` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `rayon`\n' +
        '        ON `rayon`.`idrayon` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `obl`\n' +
        '        ON `obl`.`idObl` = `rayon`.`Obl_idObl`'

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

module.exports = router

/*
router.post(
  '/',
  async (req, res) => {
    try {

    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)*/
