import {Router} from 'express'
import config from 'config'
import {initializeConnection} from '../functions/initializeConnection.js'

const router = Router()

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/map/filter
router.post(
  '/',
  [],
  async (req, res) => {
    try {

      const limiters = []

      for (const param of Object.keys(req.body)) {

        if (param === 'foundationYearFrom' && req.body.foundationYearFrom !== null) {
          limiters.push('`Founding_year` > ' + req.body.foundationYearFrom)
        } else if (param === 'foundationYearTo' && req.body.foundationYearTo !== null) {
          limiters.push('`Founding_year` < ' + req.body.foundationYearTo)
        } else if (param === 'pharmacy' && req.body.pharmacy === true) {
          limiters.push('`Pharmacy` = 1')
        } else if (param === 'firstAid' && req.body.firstAid === true) {
          limiters.push('`Access_to_primary_health_care` = 1')
        } else if (param === 'emergencyAssistance' && req.body.emergencyAssistance === true) {
          limiters.push('`Availability_of_emergency_mediical_care` = 1')
        }
      }

      const connection = initializeConnection(configDB)

      let query = 'SELECT `id_Med_punkt`, `name_Med_punkt`, `Street`, `Number_of_house`, `latitude`, `longitude`, `name_nas_punkt`, `name_rayon`, `name_obl`  FROM `med_punkt`\n' +
        '    JOIN `nas_punkt`\n' +
        '        ON `med_punkt`.`nas_punkt_id_nas_punkt` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `rayon`\n' +
        '        ON `rayon`.`idrayon` = `nas_punkt`.`id_nas_punkt`\n' +
        '    JOIN `obl`\n' +
        '        ON `obl`.`idObl` = `rayon`.`Obl_idObl`'

      if (limiters.length !== 0) {
        query += '\n WHERE'

        for (let i = 0; i < limiters.length; i++) {
          if (i === limiters.length - 1) {
            query += limiters[i]
          } else {
            query += limiters[i] + ' AND '
          }
        }
      }

      connection.query(query, (err, rows, fields) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json({data: rows})
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router