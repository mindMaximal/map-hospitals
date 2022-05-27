import {Router} from 'express'
import docx from "docx"

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, PageOrientation } = docx

const router = Router()

const getValue = (el) => {
  let value = el || ''

  if (el === null) {
    value = '-'
  } else if (parseInt(el) === 1) {
    value = 'Есть'
  } else if (parseInt(el) === 0) {
    value = 'Нет'
  }

  return value.toString()
}

const getWordDoc = (data) => {

  const getHeader = (headers) => {
    const headerCells = []

    for (let i = 0; i < headers.length; i++) {
      headerCells.push(new TableCell({
        size: 25,
        children: [

          new Paragraph({
            children: [
              new TextRun({
                text: headers[i],
                bold: true
              })
            ],
          })

        ]
      }))
    }

    return new TableRow({
      children: headerCells,
      tableHeader: true
    })
  }

  const getTableBody = (rowsData) => {
    console.log(rowsData)
    const tableBody = []

    for (let i = 0; i < rowsData.length; i++) {
      const el = rowsData[i]
      const rowCells = []

      let num = i + 1
      num = num.toString()

      rowCells.push(new TableCell({
        children: [new Paragraph(num)],
      }))

      for (let j = 0; j < el.length; j++) {
        rowCells.push(new TableCell({
          children: [new Paragraph(getValue(el[j]))],
        }))
      }

      tableBody.push(new TableRow({
        children: rowCells
      }))
    }

    return tableBody
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
          },
          margin: {
            top: 1000,
            right: 1000,
            bottom: 1000,
            left: 1000,
          },
        },
      },
      children: [

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: data.title,
              size: 22 * 2,
              bold: true
            })
          ],
        }),

        new Paragraph({
          spacing: {
            after: 500,
          },
          children: [
            new TextRun(`Дата: ${data.date}`)
          ],
        }),

        new Table({
          rows: [
            getHeader(data.headers),
            ...getTableBody(data.data)
          ],
        })

      ],
    }],
  })
}

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

      const doc = getWordDoc(options)

      Packer.toBuffer(doc).then((buffer) => {
        res.send(buffer.toString('base64'))
      });

    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router