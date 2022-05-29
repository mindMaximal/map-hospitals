import mysql from 'mysql2'
import config from 'config'

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database'),
  charset: 'utf8'
}

const population = [
  {
    id: 1,
    population_name: 'Менее 100',
    text: 'Мобильные медицинские бригады, в т.ч. с исполь- зованием комплексов передвижных медицинских',
    value: '< 100'
  },
  {
    id: 2,
    population_name: '100 - 300',
    text: 'ФАП/ФЗ, если рассто- яние до бли- жайшей МО превышает 6 км',
    value: '> 99|< 301'
  },
  {
    id: 3,
    population_name: '301 - 1000',
    text: 'ФАП/ФЗ вне зависимости от расстоя- ния в случае отсутствия других меди- цинских орга- низаций',
    value: '> 300|< 1001'
  },
  {
    id: 4,
    population_name: '1001 - 2000',
    text: 'ФАП/ФЗ, если рас- стояние до ближайшей МО не превы- шает 6 км; Центры/от- деления ОВП или врачеб- ная амбула- тория, если расстояние до ближай- шей МО пре- вышает 6 км.',
    value: '> 1000|< 2001'
  },
  {
    id: 5,
    population_name: 'Более 2000 ',
    text: 'Врачебные амбулатории вне зави- симости от расстояния до ближай- шей МО структурное подразделе- ние (отде- ления) МО, оказывающей ПМСП по террито- риально-у- частковому принципу',
    value: '> 2000'
  },
]

const staffing = [
  {
    id: 1,
    staffing_name: '100%',
    value: ' = 1'
  },
  {
    id: 2,
    staffing_name: '>= 50%',
    value: '>= 0.5'
  },
  {
    id: 3,
    staffing_name: '< 50%',
    value: '< 0.5'
  },
  {
    id: 4,
    staffing_name: '0%',
    value: '= 0'
  }
]

const getParameters = async (params) => {

  try {
    let connection = mysql.createPool(configDB)

    const result = []

    console.log(params)

    if (params.hasOwnProperty('foundationYearFrom') && params.foundationYearFrom !== null) {

      if (params.hasOwnProperty('foundationYearTo') && params.foundationYearTo !== null) {
        result.push({
          name: 'Год основания',
          value: params.foundationYearFrom + ' - ' + params.foundationYearTo
        })
      } else {
        result.push({
          name: 'Год основания',
          value: 'от ' + params.foundationYearFrom
        })
      }

    } else if (params.hasOwnProperty('foundationYearTo') && params.foundationYearTo !== null) {
      result.push({
        name: 'Год основания',
        value: 'до ' + params.foundationYearTo
      })
    }

    if (params.hasOwnProperty('area') && params.area !== null) {
      const areaName = await connection.promise().query('SELECT * FROM `district` WHERE `id` = ' + params.area)
        .then(([rows]) => {
          return rows[0].name
        })
        .catch(console.log)

      result.push({
        name: 'Район',
        value: areaName
      })
    }

    if (params.hasOwnProperty('type_id') && params.type_id !== null) {
      const typeName = await connection.promise().query('SELECT * FROM `types` WHERE `id` = ' + params.type_id)
        .then(([rows]) => {
          console.log(rows)
          return rows[0].name
        })
        .catch(console.log)

      result.push({
        name: 'Тип',
        value: typeName
      })
    }

    if (params.hasOwnProperty('population') && params.population !== null) {
      let populationName = 'Неизвестно'

      for (const el of population)
        if (el.id === params.population)
          populationName = el.population_name

      result.push({
        name: 'Население',
        value: populationName
      })
    }

    if (params.hasOwnProperty('staffing') && params.staffing !== null) {
      let staffingName = 'Неизвестно'

      for (const el of staffing)
        if (el.value === params.staffing)
          staffingName = el.staffing_name

      result.push({
        name: 'Укомплектованность',
        value: staffingName
      })
    }

    if (params.hasOwnProperty('conditions') && params.conditions !== null) {
      for (let i = 0; i < params.conditions.length; i++) {
        const el = params.conditions[i]

        if (el === 'first-aid') {
          result.push({
            name: 'Первая помощь',
            value: 'есть'
          })
        } else if (el === 'emergency-assistance') {
          result.push({
            name: 'Экстренная помощь',
            value: 'есть'
          })
        } else if (el === 'pharmacy') {
          result.push({
            name: 'Аптека',
            value: 'есть'
          })
        }

      }
    }

    console.log(params)

    connection.end()

    return result
  } catch (e) {
    throw e
  }


}

export {getParameters}