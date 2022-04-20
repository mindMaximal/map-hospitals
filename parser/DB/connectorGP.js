import mysql from 'mysql'
import data  from '../result/dataGeoPortalFullParse.json'
import locations  from '../result/locationsGeoPortal.json'

// node --experimental-json-modules connectorGP.js
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
  const queryLocality = 'SELECT `id`, `district_id`, `name` AS `locality_name` FROM `locality`'

  const subjectsGeo = locations.subjects
  const districtsGeo = locations.districts

  // Запрос на добавление областей (регионов), если какой-то области нет в БД
  /*connection.query(querySubjects, (err, rows) => {

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
  })*/

  // Запрос на добавление районов, если их нет в БД
  /*connection.query(queryDistircts, (err, rows) => {

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
  })*/

  // Сбрасываем счетчик Id и очищаем таблицу
  /*connection.query('TRUNCATE `map`.`medical_center`', (err, rows) => {
    if (err) {
      throw err
    }
  })*/

  let localities = []
  let countElements = 0
  let countBuildings = 0

  // Получим все населенные пункты
  connection.query(queryLocality, (err, rows) => {
    if (err) {
      throw err
    }
    localities = rows

    for (let i = 0; i < data.length; i++) {

      const el = data[i]

      let localityId = null
      let foundationYear = null
      let lat = el.lat
      let lon = el.lon

      countElements++
      //console.log('Число элементов ' + countElements)

      // Попроубем добавить населенный пункт
      if (el.buildings && el.buildings.data.length > 0) {

        //console.log(el.buildings)
        const building = el.buildings.data[0]

        for (let j = 0; j < localities.length; j++) {
          // Проверка на вхождение названия населенного пункта в имеющиеся населенны пункты
          if (localities[j].locality_name.toLowerCase().trim() === building.np_name.toLowerCase().trim()) {
            localityId = localities[j].id
            foundationYear = building.year || null

            lat = building.lat
            lon = building.lon

            /*countBuildings++
            console.log('Число строений у них ' + countBuildings)*/
          }
        }
      }

      const query = 'INSERT INTO `medical_center` (`id`, `locality_id`, `medical_facility_id`, `type_id`, `name`, `street`, `number_of_house`, `phone`, `latitude`, `longitude`, `pharmacy`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

      connection.query(query, [null, localityId, '1', 1, el.name, el.street, el.house, null, lat, lon, null, foundationYear, null, null, null], (err) => {
        if (err) {
          console.log(err)
          throw err
        }
      })
    }

    console.log('Число элементов ' + countElements)
    /*console.log('Число строений у них ' + countBuildings)*/
  })




  pool.end(function(err) {
    if (err) {
      return console.log(err.message)
    }
  })


} catch (e) {
  console.log('Что-то пошло не так', e)
}