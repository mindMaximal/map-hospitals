import mysql from 'mysql'
import data from '../data/locality.json'

// node --experimental-json-modules --trace-warnings  locality.js
// https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D1%81%D0%B5%D0%BB%D1%91%D0%BD%D0%BD%D1%8B%D0%B5_%D0%BF%D1%83%D0%BD%D0%BA%D1%82%D1%8B_%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA%D0%BE%D0%B9_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D0%B8
export const initializeConnection = (config) => {

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

const configDB = {
  connectionLimit: 700,
  host: '127.0.0.1',
  user: 'admin',
  password: 'admin',
  port: '3308',
  database: 'map'
}

try {

  for (let i = 0; i < data.length; i++) {

    const el = data[i]

    //console.log(el)
  }


  let connection = initializeConnection(configDB)
  //let connection = mysql.createPool(configDB)

  connection.query('SELECT `id`, `region_id`, `name` AS `district_name` FROM `district`', (err, rows, fields) => {

    if (err) {
      console.log(err)
      throw err
    }

    const localityItems = []
    const population = []

    let count = 0
    let countLocality = 0

    for (let i = 0; i < data.length; i++) {

      const el = data[i]

      for (let j = 0; j < rows.length; j++) {

        const row = rows[j]

        if (row.district_name.indexOf(el.name) + 1) {
          console.log('-----', el.name, ' : ',row.district_name)
          count++

          const districtId = row.id

          for (let k = 0; k < el.objects.length; k++) {
            const name = el.objects[k].name
            const populationCount = el.objects[k].population
            countLocality++

            localityItems.push([null, districtId, name])
            population.push([null, countLocality, populationCount, null, '2010'])

          }

        }
      }

    }

    connection.query('INSERT INTO `locality` (`id`, `district_id`, `name`) VALUES ?;', [localityItems], (err, rows, fields) => {

      if (err) {
        console.log(err)
        throw err
      }

      console.log('count', count, 'data length', data.length)
      console.log(rows)

      connection.query('INSERT INTO `population` (`id`, `locality_id`, `population_adult`, `population_child`, `year`) VALUES ?;', [population], (err, rows, fields) => {

        if (err) {
          console.log(err)
          throw err
        }

        connection.end(function(err) {
          if (err) {
            return console.log(err.message)
          } else {
            return console.log('success')
          }
        })
      })
    })

  })

} catch (e) {
  console.log('Что-то пошло не так', e)
}