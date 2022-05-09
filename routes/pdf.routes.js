import {Router} from 'express'
import ejs from 'ejs'
import path from 'path'
import htmlPdf from 'html-pdf'

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

      if (process.env.NODE_ENV === 'production') {
      }

      let pdfOptions = {
        format: 'A4',
        orientation: 'landscape',
        border: '10px'
      }

      if (process.env.NODE_ENV === 'production') {
        pdfOptions["phantomPath"] = "./node_modules/phantomjs-prebuilt/bin/phantomjs"
      }

      const fileName = 'report'
      const renderFile = path.resolve(__dirname, 'views', fileName + '.ejs')

      ejs.renderFile(renderFile, options, (err, html) => {

        if (err)
          res.status(500).json({message: 'Ошибка при рендере .ejs файла ' + err})

        const renderHtml = html.replace(/img src=\//g, 'img src="file://' + __dirname + "/")

        htmlPdf.create(renderHtml, pdfOptions).toBuffer((error, buffer) => {
          if (error) {
            res.status(500).json({message: 'Ошибка конвертации ' + error})
          }

          const pdf = buffer.toString('base64')
          res.send(pdf)
        })

      })

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router