import mysql from 'mysql'
import data  from '../result/dataGeoPortal.json'
import locations  from '../result/locationsGeoPortal.json'

// node --experimental-json-modules connector.js
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
  host: '127.0.0.1',
  user: 'admin',
  password: 'admin',
  port: '3308',
  database: 'map'
}

try {

  //let connection = initializeConnection(configDB)
  let connection = mysql.createPool(configDB)

  const querySubjects = 'SELECT `id`, `name` AS `region_name` FROM `region`'
  const queryDistircts = 'SELECT `id`, `region_id`, `name` AS `district_name` FROM `district`'

  const subjectsGeo = locations.subjects
  const districtsGeo = locations.districts

  connection.query(querySubjects, (err, rows) => {

    if (err) {
      throw err
    }

    for (let i = 0; i < subjectsGeo.length; i++) {
      const el = subjectsGeo[i]
      let flag = true

      for (let j = 0; j < rows.length; j++) {
        const row = rows[j]

        if (row.region_name.toLowerCase() === el.toLowerCase()) {
          flag = false
        }
      }

      if (flag) {
        const queryAdd = `INSERT INTO \`region\` (\`id\`, \`name\`) VALUES (NULL, '${el}');`

        connection.query(queryAdd, (err) => {
          if (err) {
            throw err
          }
        })

        console.log('Добавлена область', el)
      }
    }
  })

  connection.query(queryDistircts, (err, rows) => {

    if (err) {
      throw err
    }


    for (let i = 0; i < districtsGeo.length; i++) {
      const el = districtsGeo[i]
      let flag = true

      for (let j = 0; j < rows.length; j++) {
        const row = rows[j]

        if (row.district_name.toLowerCase() === el.toLowerCase()) {
          flag = false
        }
      }

      if (flag) {
        const queryAdd = `INSERT INTO \`district\` (\`id\`, \`region_id\`, \`name\`) VALUES (NULL, '1', '${el}');`

        connection.query(queryAdd, (err) => {
          if (err) {
            throw err
          }
        })

        console.log('Добавлен район', el)
      }
    }
  })

  /*connection.query('TRUNCATE `map`.`medical_center`', (err, rows) => {
    if (err) {
      throw err
    }
  })*/

  let districts = []

  connection.query(queryDistircts, (err, rows) => {
    if (err) {
      throw err
    }
    districts = rows


    for (let i = 0; i < data.length; i++) {

      const el = data[i]

      let localityId = null

      for (let j = 0; j < districts.length; j++) {
        if (districts[j].district_name.toLowerCase().trim() === el.district.toLowerCase().trim()) {
          console.log(el.district)
          // Ошибка locality и district
          localityId = districts[j].id
        }
      }


      const query = 'INSERT INTO `medical_center` (`id`, `locality_id`, `medical_facility_id`, `type_id`, `name`, `street`, `number_of_house`, `phone`, `latitude`, `longitude`, `pharmacy`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'


      connection.query(query, [null, localityId, '1', el.types ? el.types.name : null, el.name, el.street, el.house, null, el.lat, el.lon, null, el.foundationYear, null, null, null], (err) => {

        if (err) {
          console.log(err)
          throw err
        }
      })
    }
  })


  pool.end(function(err) {
    if (err) {
      return console.log(err.message)
    }
  })

} catch (e) {
  console.log('Что-то пошло не так', e)
}