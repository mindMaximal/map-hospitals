const mysql = require('mysql')
const {Router} = require('express')
const config = require('config')
const router = Router()
//let data = require('../parser/result/data.json');

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

const initializeConnection = (config) => {

  const addDisconnectHandler = (connection) => {
    connection.on("error", function (error) {
      if (error instanceof Error) {
        if (error.code === "PROTOCOL_CONNECTION_LOST") {
          console.error(error.stack)
          console.log("Lost connection. Reconnecting...")

          initializeConnection(connection.config);
        } else if (error.fatal) {
          throw error
        }
      }
    })
  }

  const connection = mysql.createConnection(config)

  addDisconnectHandler(connection)

  connection.connect()
  return connection
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
        if (err) {
          throw err
        }

        console.log(rows)

        res.json({data: rows})

      })
      //Подмена для dev-mode

      /*try {
        data = data.data

      } catch (er) {
        console.log(er)
      }

      res.json({
        data
      })*/

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
