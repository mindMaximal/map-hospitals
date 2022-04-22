import mysql from 'mysql2'
import data  from '../result/dataGeoPortalFullParse.json'

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
  let connection = mysql.createPool(configDB)

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

  let date = new Date()
  date = date.getFullYear() + '-' + (date.getMonth() < 10? '0' + date.getMonth() : date.getMonth()) + '-' + date.getDate()

  // Получим все населенные пункты
 await connection.promise().query('SELECT `id`, `district_id`, `name` AS `locality_name` FROM `locality`')
    .then(([rows]) => {
      localities = rows
    })
    .catch(console.log)

  for (let i = 0; i < data.length; i++) {

    const el = data[i]

    let localityId = null
    let foundationYear = null
    let lat = el.lat
    let lon = el.lon
    let staffing = null
    let medicalFacilityId = null

    const rates = []

    countElements++
    //console.log('Элемент ' + countElements)

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

    // Добавляем ставки
    if (el.positions && el.positions.data.length > 0) {
      const positions = el.positions.data

      let rateFullSum = 0
      let rateOccupiedSum = 0

      for (let j = 0; j < positions.length; j++) {
        const rateName = positions[j].work_position_name || null
        const rateFull = positions[j].count_all
        const rateOccupied = positions[j].count_busy

        rateFullSum += rateFull
        rateOccupiedSum += rateOccupied

        rates.push([null, 'id', date, rateName, rateFull, rateOccupied])
      }

      // Округляем до 2 знака
      staffing = Math.floor(rateOccupiedSum / rateFullSum * 100) / 100
    }

    // Добавляем головную организацию
    if (el.mainMo) {

      await connection.promise().query("SELECT * FROM `medical_facility` WHERE `name` = '" + el.mainMo.name + "'")
        .then(([rows]) => {
          if (rows.length > 0)
            medicalFacilityId = rows[0].id
        })
        .catch(console.log)

      if (!medicalFacilityId) {
        const mainOrg = [null, el.mainMo.id, el.mainMo.name, el.mainMo.lat, el.mainMo.lon, null, 3, el.mainMo.street, el.mainMo.house, null, el.mainMo.organization, el.mainMo.ogrn, el.mainMo.kpp]

        await connection.promise().query("INSERT INTO `medical_facility` (`id`, `binding key`, `name`, `latitude`, `longitude`, `locality_id`, `type_id`, `street`, `number_of_house`, `phone`, `organization`, `ogrn`, `kpp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", mainOrg)
          .then(([rows]) => {
            console.log('Добавили medical_facility ', rows.insertId)
            medicalFacilityId = rows.insertId
          })
          .catch(console.log)
      }

      // node --experimental-json-modules connectorGP.js
    }

    const query = 'INSERT INTO `medical_center` (`id`, `locality_id`, `medical_facility_id`, `type_id`, `name`, `street`, `number_of_house`, `phone`, `latitude`, `longitude`, `pharmacy`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`, `staffing`)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

    connection.promise().query(query, [null, localityId, medicalFacilityId, 1, el.name, el.street, el.house, null, lat, lon, null, foundationYear, null, null, staffing])
      .then(([rows]) => {
        // Подставляем id мед. центра, полученный из запроса
        for (let j = 0; j < rates.length; j++) {
          rates[j][1] = rows.insertId
        }

        return rates
      })
      .then((array) => {
        // Добавляем записи о ставка, если они есть в этом объекте
        if (array.length > 0) {
          const staffQuery = 'INSERT INTO `staff` (`id`, `medical_center_id`, `date`, `position`, `rate_full`, `rate_occupied`) VALUES ?'

          connection.promise().query(staffQuery, [array])
            .catch(console.log)
        }
      })
      .catch(console.log)
  }

  connection.end()
/*  connection.query(queryLocality, (err, rows) => {
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
      let staffing = null
      let medicalFacilityId = null

      const rates = []

      countElements++
      //console.log('Элемент ' + countElements)

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

            /!*countBuildings++
            console.log('Число строений у них ' + countBuildings)*!/
          }
        }
      }

      // Добавляем ставки
      if (el.positions && el.positions.data.length > 0) {
        const positions = el.positions.data

        let rateFullSum = 0
        let rateOccupiedSum = 0

        for (let j = 0; j < positions.length; j++) {
          const rateName = positions[j].work_position_name || null
          const rateFull = positions[j].count_all
          const rateOccupied = positions[j].count_busy

          rateFullSum += rateFull
          rateOccupiedSum += rateOccupied

          rates.push([null, 'id', date, rateName, rateFull, rateOccupied])
        }

        // Округляем до 2 знака
        staffing = Math.floor(rateOccupiedSum / rateFullSum * 100) / 100
      }

      // Добавляем головную организацию
      if (el.mainMo) {
        /!*connection.query("SELECT * FROM `medical_facility` WHERE `name` = '" + el.mainMo.name + "'", (err, rows) => {

          if (rows.length > 0) {
            medicalFacilityId = rows.id
            console.log(rows)
          } else {
            const mainOrg = [null, el.mainMo.id, el.mainMo.name, el.mainMo.lat, el.mainMo.lon, null, 3, el.mainMo.street, el.mainMo.house, null, el.mainMo.organization, el.mainMo.ogrn, el.mainMo.kpp]

            connection.query("INSERT INTO `medical_facility` (`id`, `binding key`, `name`, `latitude`, `longitude`, `locality_id`, `type_id`, `street`, `number_of_house`, `phone`, `organization`, `ogrn`, `kpp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", mainOrg, (err, res) => {
              if (err) throw err

              medicalFacilityId = res.insertId
            })
          }
        })*!/

        medicalFacilityId = getIdorganization
        console.log(medicalFacilityId)
        // node --experimental-json-modules connectorGP.js
      } else {

      }

      const query = 'INSERT INTO `medical_center` (`id`, `locality_id`, `medical_facility_id`, `type_id`, `name`, `street`, `number_of_house`, `phone`, `latitude`, `longitude`, `pharmacy`, `founding_year`, `availability_of_emergency_mediical_care`, `access_to_primary_health_care`, `staffing`)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

      /!*connection.query(query, [null, localityId, '1', 1, el.name, el.street, el.house, null, lat, lon, null, foundationYear, null, null, staffing], (err, res) => {
        if (err) {
          console.log(err)
          throw err
        }

        // Подставляем id мед. центра, полученный из запроса
        for (let j = 0; j < rates.length; j++) {
          rates[j][1] = res.insertId
        }

        // Добавляем записи о ставка, если они есть в этом объекте
        if (rates.length > 0) {
          const staffQuery = 'INSERT INTO `staff` (`id`, `medical_center_id`, `date`, `position`, `rate_full`, `rate_occupied`) VALUES ?'

          connection.query(staffQuery, [rates], (err) => {if (err) throw err})
        }
      })*!/
    }

    console.log('Число элементов ' + countElements)
    /!*console.log('Число строений у них ' + countBuildings)*!/
  })*/

/*.then(() => {
  connection.end()
})
.then(()=>{
  console.log("пул закрыт");
})*/


} catch (e) {
  console.log('Что-то пошло не так', e)
}

/*

"mainMo": {
			"lat": "56.09138889",
			"lon": "99.65027778",
			"subject": "Иркутская область",
			"district": "Чунский район",
			"np_name": null,
			"name": "областное государственное бюджетное учреждение здравоохранения \"Чунская районная больница\"",
			"organization": "Органы исполнительной власти субъектов Российской Федерации, осуществляющие функции в области здравоохранения",
			"ogrn": "1023802805190",
			"kpp": "384401001",
			"street": "Советская",
			"house": "24 ",
			"fio_gv": "Онуфриади Анастас Георгиевич",
			"telefon_gv": "9645453844",
		},
 */