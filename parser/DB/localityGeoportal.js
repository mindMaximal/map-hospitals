import mysql from 'mysql2'
import data from '../data/localityGeoportal.json'

// node --experimental-json-modules --trace-warnings  localityGeoportal.js
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
  let districts = []
  const localities = []

  let connection = mysql.createPool(configDB)

  for (let i = 0; i < data.length; i++) {
    const el = data[i]

    districts.push(el['Район'])
  }

  const uniqueDistricts = [...new Set(districts)]

  districts = []

  for (let i = 0; i < uniqueDistricts.length; i++) {
    districts.push([null, 1, uniqueDistricts[i]])
  }

  let query = 'INSERT INTO `district` (`id`, `region_id`, `name`) VALUES ?'

  /*await connection.promise().query(query, [districts])
    .catch(console.log)*/

  districts = await await connection.promise().query('SELECT * FROM `district`')
    .then(([rows]) => {
      return rows
    })
    .catch(console.log)

  for (let i = 0; i < data.length; i++) {
    const el = data[i]

    let district_id = null

    for (let j = 0; j < districts.length; j++) {

      if (el['Район'].toLowerCase().trim() === districts[j]['name'].toLowerCase().trim()) {
        district_id = districts[j].id
        break
      }
    }

    const locality = [null, district_id, el['Населенный пункт']]

    const localityId = await await await connection.promise().query('INSERT INTO `locality` (`id`, `district_id`, `name`) VALUES (?);', [locality])
      .then(([rows]) => {
        console.log(rows.insertId)
        return rows.insertId
      })
      .catch(console.log)

    const population = [null, localityId, el['Население'], el['В том числе детей'], '2022']

    query = 'INSERT INTO `population` (`id`, `locality_id`, `population_adult`, `population_child`, `year`) VALUES (?);'

    await await await connection.promise().query(query, [population])
      .catch(console.log)
  }

  connection.end()

} catch (e) {
  console.log('Что-то пошло не так', e)
}