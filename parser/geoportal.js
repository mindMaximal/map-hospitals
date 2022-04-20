import fetch from "node-fetch"
import fs from "fs"

// node --experimental-json-modules geoportal.js
// id = 16181631
const getUrl = (id) => {
  return `https://geoportal.egisz.rosminzdrav.ru/map/object?id=${id}`
}

const path = './result/dataGeoPortalFullParse.json'

const subStrShort = 'фап'
const subStrLong = 'фельд'

const start = 16337589
const stop = 16700000
//            10000000
//            16180000
//            16181631

let errorsCount = 0

for (let i = start; i < stop; i++) {
  console.log(getUrl(i))
  try {
    await fetch(getUrl(i))
      .then(res => res.json())
      .then(json => {

        if ( ( json.name.toLowerCase().trim().includes(subStrShort) || json.name.toLowerCase().trim().includes(subStrLong) ) && json.subject.toLowerCase().trim().includes('иркутская') ) {

          const data = fs.readFileSync(path)
          const results = JSON.parse(data)

          console.log(json.name)
          console.log(results.length)

          if (results.find(el => el.id === json.id)) {

            console.log('Попытка повторной записи!', json.id)
            return false
          }

          results.push(json)

          fs.writeFileSync(path, JSON.stringify(results,  null, '\t'))
        }
    })
  }
  catch (e) {
    errorsCount++
    console.log('Ошибка №',errorsCount)
  }

}

/*
*    https://geoportal.egisz.rosminzdrav.ru/map/object?id=14861957
*
* */