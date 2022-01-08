import {Router} from 'express'
import config from 'config'
import multer from 'multer'
import {initializeConnection} from '../functions/initializeConnection.js'
import fs from 'fs'

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

const deleteFile = (filename) => {
  try {
    fs.unlinkSync('./client/public/attached/images/' + filename)
    console.log('Файл удален:', filename)
  } catch (e) {
    console.log('Ошибка удаления файла', e)
  }
}

// /api/upload/images
router.post(
  '/images',
  multer(({storage:storageConfig, fileFilter: fileFilter})).single("filedata"),
  async (req, res) => {
    try {

      if(!req.file)
        res.status(500).json({message: 'Неверный формат файла'})

      const connection = initializeConnection(configDB)

      try {
        connection.query('INSERT INTO `photo` (`id`, `medical_center_id`, `name`) VALUES (?, ?, ?)', [null, req.body.id, req.file.filename], (err, rows, fields) => {
          connection.end()

          if (err) {
            deleteFile(req.file.filename)
            throw err
          }

          res.status(200).send({
            message: 'Файл загружен',
            image: {
              id: rows.insertId,
              medical_center_id: parseInt(req.body.id),
              name: req.file.filename
            }
          })
        })
      } catch (sqlErrors) {
        deleteFile(req.file.filename)
        console.log('SQL Errors', sqlErrors)
      }

    } catch (e) {
      deleteFile(req.file.filename)
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

// /api/upload/images/delete
router.post(
  '/images/delete',
  [],
  async (req, res) => {
    try {

      const connection = initializeConnection(configDB)

      try {
        connection.query('DELETE FROM `photo` WHERE `photo`.`id` = ?', [req.body.id], (err, rows, fields) => {
          connection.end()

          if (err) {
            throw err
          }

          deleteFile(req.body.name)

          res.status(200).send({
            message: 'Файл удален'
          })
        })
      } catch (sqlErrors) {
        console.log('SQL Errors', sqlErrors)
      }

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router