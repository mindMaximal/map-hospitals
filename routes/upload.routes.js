import {Router} from 'express'
import config from 'config'
import multer from 'multer'
import {initializeConnection} from '../functions/initializeConnection.js'

const router = Router()

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "./client/public/attached/images/")
  },
  filename: (req, file, cb) =>{

    let fileName = file.originalname.split('.')
    const exp = fileName.pop()

    const now = new Date()
    let date = '(' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds()  + '-' +  now.getDay()  + '-' +  (now.getMonth() + 1)  + '-' +  now.getFullYear() + ')'

    fileName = fileName.join() + date + '.' + exp

    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {

  if(file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"||
    file.mimetype === "image/jpeg") {
    cb(null, true)
  }
  else{
    cb(null, false)
  }
}

const configDB = {
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  port: config.get('portDB'),
  database: config.get('database')
}

// /api/upload/images
router.post(
  '/images',
  multer(({storage:storageConfig, fileFilter: fileFilter})).single("filedata"),
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      const filedata = req.file

      console.log(filedata)

      if(!filedata)
        res.status(500).json({message: 'Неверный формат файла'})
      else
        res.status(200).send({message: 'Файл загружен'})

      /*const query = 'SELECT `id`, `region_id`, `name` AS `district_name` FROM `district`'

      connection.query(query, (err, rows, fields) => {
        connection.end()

        if (err) {
          throw err
        }

        res.json(rows)
      })*/

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router