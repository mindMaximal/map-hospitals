const cherio = require('cherio')
const data = require('./data/data.json')
const fs = require('fs')
const PuppeteerHandler =  require('./functions/puppeteer')

const p = new PuppeteerHandler()
const SPACE = '%20'

const getInfoList = async (data) => {
  try {

    let success = []
    let errors = []
    let parents = []
    let similar = 0

    let parentId = 0

    for (const org of data) {

      parentId++

      const parent = org.name

      const parentObj = {
        name: parent,
        id: parentId
      }

      parents.push(parentObj)

      for (const page of org.data) {

        console.log('Обработка страницы: ', page)

        //let name = page.replace(/.\.\s/g, '')
        let name = page.replace(/\s/g, SPACE),
            url = `https://yandex.ru/maps/?mode=search&text=${name}`,
            pageContent = await p.getPageContent(url)

        if (pageContent === null) {
          console.log('Ошибка на странице: ' + page + ' вторая попытка поиска информации')

          name = page.replace(/.\.\s/g, '').replace(/\s/g, SPACE)

          url = `https://yandex.ru/maps/?mode=search&text=${name}`

          pageContent = await p.getPageContent(url)

          if (pageContent === null) {
            console.log(`   - Вторая попытка не дала результата\r\n\   - ${url}\r\n`)

            const error = {
              name: page,
              url,
              parent,
              parentId
            }

            errors.push(error)

            break
          }
          console.log('\t - Вторая попытка оказалось удачной')
        }

        const $ = cherio.load(pageContent)

        const nameYandex = $('.card-title-view__title-link').text()
        const geo = $('.card-share-view__text').text()
        const address = $('.business-contacts-view__address-link').text()

        const obj = {
          name: page,
          nameYandex,
          geo,
          address,
          parent,
          parentId
        }

        let isUnique = true

        for (const obj_ of success) {
          if (obj.geo == obj_.geo) isUnique = false
        }

        if (isUnique) {
          console.log(obj)
          success.push(obj)
        } else similar++
      }
    }

    return {
      data: success,
      errors: errors,
      parents: parents,
      similar: similar
    }

  } catch (e) {
    throw e
  } finally {
    p.closeBrowser()
  }
}

getInfoList(data).then((res) => {
  fs.writeFile("result/data.json", JSON.stringify(res,  null, '\t'), (e) => {
    if(e) throw e; // если возникла ошибка
    console.log("Запись файла завершена.");
  });

}).catch(e => {
  console.log('Ошибка: ', e)
})
