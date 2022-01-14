import mysql from 'mysql'
import config from 'config'
import data from './result/info.json'
import parents from './result/parents.json'

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

try {

  const connection = initializeConnection(configDB)

  connection.query('TRUNCATE `organizations`.`units`', (err, rows, fields) => {
    if (err) {
      throw err
    }
    console.log('Таблица "units" очищена')
  })

  connection.query('TRUNCATE `map`.`units`', (err, rows, fields) => {
    if (err) {
      throw err
    }
    console.log('Таблица "units" очищена')
  })

  for (let el of parents) {
    console.log(`INSERT INTO \`organizations\` (\`id\`, \`name\`) VALUES (NULL, '${el.name}')\r\n`)
    /*connection.query(`INSERT INTO \`organizations\` (\`id\`, \`name\`) VALUES (NULL, '${el.name}')`, (err, rows, fields) => {
      if (err) {
        throw err
      }

    })*/
  }

  for (let el of data) {
    console.log(`INSERT INTO \`units\` (\`id\`, \`name\`, \`text\`, \`geo\`, \`parentId\`) VALUES (NULL, '${el.name}', 'null', '${el.geo}', '${el.parentId}')\r\n`)
    /*connection.query(`INSERT INTO \`units\` (\`id\`, \`name\`, \`text\`, \`geo\`, \`parentId\`) VALUES (NULL, '${el.name}', 'null', '${el.geo}', '${el.parentId}')`, (err, rows, fields) => {
      if (err) {
        throw err
      }

    })*/
  }

} catch (e) {
  console.log('Ошибка: ', e)
}