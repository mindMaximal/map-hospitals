import {Router} from 'express'
import ejs from 'ejs'
import path from 'path'
import fs from 'fs'
//import * as docx from 'docx'
import docx from "docx"

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } = docx;


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

      const fileName = 'report'
      const renderFile = path.resolve(__dirname, 'views', fileName + '.ejs')
      const outputFile = path.join(__dirname, 'pdf', fileName + '.docx')

      /*const htmlString = await ejs.renderFile(renderFile, options, {async: true})

      fs.writeFile('test.html', htmlString, () => {

      })

      const fileBuffer = await HTMLtoDOCX(htmlString, null, {
        table: { row: { cantSplit: true } },
        orientation: 'landscape',
        pageNumber: true,
      })*/

      const doc = new Document({
        sections: [{
          properties: {},
          children: [

            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("hello")],
                    }),
                  ],
                }),
              ],
            })

          ],
        }],
      });

      Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("My Document.docx", buffer);
        const word = buffer.toString('base64')

        res.send(word)
      });

      /*fs.writeFile(outputFile, fileBuffer, (error) => {
        if (error)
          throw error

        fs.readFile(outputFile, (err, data) => {
          if (err)
            throw err

          const word = data.toString('base64')
          res.send(word)

          fs.unlink(outputFile, (err) => {
            if (err) {
              res.status(500).json({message: 'Ошибка удаления ' + err})
            }
          })

        })
      })*/

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router