import fetch from 'node-fetch'
import fs from "fs";

const url = 'https://geoportal.egisz.rosminzdrav.ru/list/mo?369p=0&369p_constr=0&buildings=%7B%22type%22:%22active%22,%22subType%22:%22all%22,%22stage%22:null,%22date%22:null%7D&district=%D0%A0%D0%B0%D0%B9%D0%BE%D0%BD&equipments=&limit=100000&offset=0&positionsMO=%7B%22selected%22:null,%22from%22:null,%22to%22:null%7D&profile=&subject=%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C&types='
const subStrShort = 'фап'
const subStrLong = 'фельд'

fetch(url)
  .then(res => res.json())
  .then(json => {

    const elements = []

    console.log('Количество объектов', json.data.length)

    for (let i = 0; i < json.data.length; i++) {
      const el = json.data[i]

      elements.push(el)

      if (el.subMo) {

        for (let j = 0; j < el.subMo.length; j++) {
          elements.push(el.subMo[j])

          if (el.subMo[j].subMo)
            console.log(el.subMo[j].subMo)
        }

      }

    }

    json = null
    console.log('Общее количество объектов', elements.length)
    
    const results = []

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      let name = el.name.trim().toLowerCase()

      if (name.includes(subStrShort) || name.includes(subStrLong)) {
        results.push(el)
      }
    }

    console.log('Количество подходящих объектов', results.length)

    fs.writeFile("result/dataGeoPortal.json", JSON.stringify(results,  null, '\t'), (e) => {
      if(e) throw e; // если возникла ошибка
      console.log("Запись файла завершена.");
    });
  })

/*
*    https://geoportal.egisz.rosminzdrav.ru/map/object?id=14861957
*
* */