import {Router} from 'express'
import ejs from 'ejs'
import path from 'path'
import htmlPdf from 'html-pdf'
import fs from 'fs'

const router = Router()
const __dirname = path.resolve()

// /api/reports/pdf
router.post(
  '/',
  [],
  async (req, res) => {
    try {
      let date = new Date();
      let month = date.getMonth() + 1;
      month = (month < 10 ? '0' + month : month);
      let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      date = day + '.' + month + '.' + date.getFullYear();

      const receivedData = []

      if (req.body.objects.length > 0) {
        for (const object of req.body.objects) {
          receivedData.push(Object.values(object))
        }
      }

      const options = {
        title: req.body.title || 'Отчет',
        date: date,
        headers: req.body.headers || 'Без заголовков',
        data: receivedData
      }

      const pdfOptions = {
        format: 'A4',
        orientation: 'landscape',
        border: '10px',
      }

      const fileName = 'report'
      const renderFile = path.resolve(__dirname, 'views', fileName + '.ejs')
      const outputFile = path.join(__dirname, 'pdf', fileName + '.pdf')

      ejs.renderFile(renderFile, options, (err, html) => {

        if (err)
          res.status(500).json({message: 'Ошибка при рендере .ejs файла ' + err})

        const renderHtml = html.replace(/img src=\"\//g, 'img src="file://' + __dirname + "/")

        htmlPdf.create(renderHtml, pdfOptions).toFile(outputFile, (err) => {

          if (err) {
            res.status(500).json({message: 'Ошибка конвертации ' + err})
          }

          fs.readFile(outputFile, (err, data) => {
            if (err)
              throw err

            const pdf = data.toString('base64')
            res.send(pdf)

            fs.unlink(outputFile, (err) => {
              if (err) {
                res.status(500).json({message: 'Ошибка удаления ' + err})
              }
            })

          })
        })
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router