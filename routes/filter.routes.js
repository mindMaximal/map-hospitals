const mysql = require('mysql')
const {Router} = require('express')
const config = require('config')
const router = Router()
const dataFile = require('../parser/result/data.json');

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

// /api/map/filter
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      console.log(req.body)

      /*const connection = initializeConnection(configDB)

      connection.query('SELECT * FROM units', (err, rows, fields) => {
        if (err) {
          throw err
        }

        //res.json({data: rows})

      })*/
      //Подмена для dev-mode
      const resData = []

      try {
        const data = dataFile.data

        for (const el of data) {

          let flag = true

          for (const param of Object.keys(req.body)) {

            if (param === 'foundationYearFrom' && req.body.foundationYearFrom !== null) {
              if (el.foundationYear < req.body.foundationYearFrom) {
                flag = false
              }
            } else if (param === 'foundationYearTo' && req.body.foundationYearTo !== null) {
              if (el.foundationYear > req.body.foundationYearTo) {
                flag = false
              }
            } else if (req.body[param] !== null && el[param] !== req.body[param]) {
              flag = false
            }
          }

          if (flag) {
            resData.push(el)
          }

        }

      } catch (er) {
        console.log(er)
      }

      const data = resData

      res.json({
        data
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
