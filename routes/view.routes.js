import {Router} from 'express'
import config from 'config'
import {initializeConnection} from '../functions/initializeConnection.js'
import {normalizeData} from "../functions/normalizeData.js"
import mappings from "../mappings.js"

const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/view/
router.post(
  '/',
  [],
  async (req, res) => {
    try {
      const connection = initializeConnection(configDB)

      const query = 'SELECT `name_Med_punkt`, `Phone_number`, `Founding_year`, `Availability_of_emergency_mediical_care`, `Access_to_primary_health_care`, `Pharmacy`, `name_nas_punkt`, `name_rayon`, `name_obl`, `Street`, `Number_of_house`, `id_Med_punkt`  FROM `med_punkt`\n' +
        '    JOIN `nas_punkt`\n' +
        '        ON `med_punkt`.`nas_punkt_id_nas_punkt` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `rayon`\n' +
        '        ON `rayon`.`idrayon` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `obl`\n' +
        '        ON `obl`.`idObl` = `rayon`.`Obl_idObl`'

      connection.query(query, (err, rows, fields) => {
        connection.end()

        if (err) {
          throw err
        }

        if (rows.length === 0) {
          res.json({
            objects: [],
            headers: []
          })

          return
        }

        normalizeData(rows, true)

        const headers = []

        for (const key of Object.keys(rows[0])) {

          for (const mapping of mappings) {
            if (key === mapping.queryName) {
              headers.push(mapping.columnName)
            }
          }
        }

        res.json({
          data: rows,
          headers
        })
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router