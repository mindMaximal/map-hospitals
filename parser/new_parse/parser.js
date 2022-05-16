import fetch from 'node-fetch'
import fs from "fs"

const path = '../result/dataGeoPortal.json'

const data = fs.readFileSync(path)
const results = JSON.parse(data)

const objects = []

for (let i = 0; i < results.length; i++) {
  const object = results[i]

  const parseString = await fetch(`https://geoportal.egisz.rosminzdrav.ru/map/object?id=${object.id}`)
    .then(res => res.json())
    .catch(e => console.log(e))

  console.log('Получен объект №', i + 1)

  objects.push(parseString)
}

fs.writeFile("../result/dataGeoPortalPointParse.json", JSON.stringify(objects,  null, '\t'), (e) => {
  if(e) throw e
  console.log("Запись файла завершена.")
})