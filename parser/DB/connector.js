import mysql from 'mysql'
import data  from '../result/dataGeoPortal.json'

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

  const connection = initializeConnection(configDB)

  for (let i = 0; i < data.length; i++) {
    const el = data[i]

    const query = `INSERT INTO \`med_punkt\` (\`id_Med_punkt\`, \`nas_punkt_id_nas_punkt\`, \`med_uch_idmed_uch\`, \`Medperc_idMedperc\`, \`type_Med_punkt\`, \`name_Med_punkt\`, \`Street\`, \`Number_of_house\`, \`Phone_number\`, \`latitude\`, \`longitude\`, \`Pharmacy\`, \`Photo\`, \`Founding_year\`, \`Availability_of_emergency_mediical_care\`, \`Access_to_primary_health_care\`) 
                   VALUES (NULL, '2', '1', '1', '${el.type_id}', '${el.name}', '${el.street}', '${el.house}', NULL, '${el.lat}', '${el.lon}', NULL, NULL, NULL, NULL, NULL);`

    connection.query(query, (err, rows, fields) => {

      if (err) {
        throw err
      }
    })
  }

  connection.end()

} catch (e) {
  console.log('Что-то пошло не так', e)
}