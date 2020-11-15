const cherio = require('cherio')
const data = require('./data/data.json')
const fs = require('fs')
const path = require('path')
const PuppeteerHandler =  require('./functions/puppeteer')

const p = new PuppeteerHandler()
const SPACE = '%20'

const main = async (result, errors, input, inputError) => {
  try {

    input.write('[\r\n')
    inputError.write('[\r\n')

    let parentId = 0

    for (const org of data) {

      parentId++

      const parent = org.name

      for (const page of org.data) {

        console.log('Обработка страницы: ', page)

        //let name = page.replace(/.\.\s/g, '')
        let name = page.replace(/\s/g, SPACE),
            url = `https://yandex.ru/maps/?mode=search&text=${name}`,
            pageContent = await p.getPageContent(url)

        if (pageContent === null) {
          console.log('Ошибка на странице: ' + page + ' вторая попытка поиска информации')

          name = name.replace(/.\.\s/g, '')

          url = `https://yandex.ru/maps/?mode=search&text=${name}`

          pageContent = await p.getPageContent(url)

          if (pageContent === null) {
            console.log(`   - Вторая попытка не дала результата\r\n\   - ${url}\r\n`)

            const error = {
              name: page,
              url
            }

            errors.push(error)
            inputError.write('  ' + JSON.stringify(error, null, 2) + ',')

            break
          }

          console.log('   - Вторая попытка оказалось удачной')

        }

        const $ = cherio.load(pageContent)

        const nameYandex = $('.card-title-view__title-link').text()
        const geo = $('.card-share-view__text').text()

        const obj = {
          name: page,
          nameYandex,
          geo,
          parent,
          parentId
        }

        console.log(obj)
        result.push(obj)
        input.write('  ' + JSON.stringify(obj, null, 2) + ',\r\n')

      }

    }

    input.end(JSON.stringify(']'))
    inputError.end(JSON.stringify(']'))

  } catch (e) {
    throw e
  } finally {
    p.closeBrowser()
  }
}

const clearDirectory = directory => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err
      })
    }
  })
}

const info = []
const errors = []

const directory = 'result';

clearDirectory(directory)

let fileInfo = fs.createWriteStream('result/info.json')
let fileErrors = fs.createWriteStream('result/errors.json')

main(info, errors, fileInfo, fileErrors).then(() => {

}).catch(e => {
  console.log('Ошибка: ', e)
})
