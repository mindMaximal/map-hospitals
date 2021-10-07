import mysql from 'mysql'
import data  from '../result/dataGeoPortal.json'
import locations  from '../result/locationsGeoPortal.json'

// --experimental-json-modules
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

  let connection = initializeConnection(configDB)

  const querySubjects = `SELECT * FROM \`obl\``
  const queryDistircts = `SELECT * FROM \`rayon\``

  let subjectsDB = null
  let distirctsDB = null

  const subjectsGeo = locations.subjects
  const districtsGeo = locations.districts

 /* connection.query(querySubjects, (err, rows, fields) => {

    if (err) {
      throw err
    }

    for (let i = 0; i < subjectsGeo.length; i++) {
      const el = subjectsGeo[i]
      let flag = true

      for (let j = 0; j < rows.length; j++) {
        const row = rows[j]

        if (row.name_obl.toLowerCase() === el.toLowerCase()) {
          flag = false
        }
      }

      if (flag) {
        const queryAdd = `INSERT INTO \`obl\` (\`idObl\`, \`name_obl\`) VALUES (NULL, '${el}');`

        connection.query(queryAdd, (err, rows, fields) => {
          if (err) {
            throw err
          }
        })

        console.log('Добавлена область', el)
      }
    }
  })

  connection.end()
  connection = initializeConnection(configDB)

  connection.query(queryDistircts, (err, rows, fields) => {

    if (err) {
      throw err
    }

    connection.end()
    connection = initializeConnection(configDB)

    for (let i = 0; i < districtsGeo.length; i++) {
      const el = districtsGeo[i]
      let flag = true

      for (let j = 0; j < rows.length; j++) {
        const row = rows[j]

        if (row.name_rayon.toLowerCase() === el.toLowerCase()) {
          flag = false
        }
      }

      if (flag) {
        const queryAdd = `INSERT INTO \`rayon\` (\`idrayon\`, \`Obl_idObl\`, \`name_rayon\`) VALUES (NULL, '1', '${el}');`

        connection.query(queryAdd, (err, rows, fields) => {
          if (err) {
            throw err
          }
        })

        console.log('Добавлен район', el)
      }
    }
  })*/

/*  for (let i = 0; i < data.length; i++) {

    const el = data[i]

    const query = `INSERT INTO \`med_punkt\` (\`id_Med_punkt\`, \`nas_punkt_id_nas_punkt\`, \`med_uch_idmed_uch\`, \`Medperc_idMedperc\`, \`type_Med_punkt\`, \`name_Med_punkt\`, \`Street\`, \`Number_of_house\`, \`Phone_number\`, \`latitude\`, \`longitude\`, \`Pharmacy\`, \`Photo\`, \`Founding_year\`, \`Availability_of_emergency_mediical_care\`, \`Access_to_primary_health_care\`) 
                   VALUES (NULL, '2', '1', '1', '${el.types ? el.types.name : 'NULL'}', '${el.name}', '${el.street}', '${el.house}', NULL, '${el.lat}', '${el.lon}', NULL, NULL, NULL, NULL, NULL);`

    connection.query(query, (err, rows, fields) => {

      if (err) {
        throw err
      }
    })
  }*/

  connection.end()

} catch (e) {
  console.log('Что-то пошло не так', e)
}