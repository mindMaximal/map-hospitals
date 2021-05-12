const mappings = require("../mappings")
const {getAddress} = require("../functions/getAddress")

const normalizeData = (rows, haveAddress = false) => {
  for (const row of rows) {

    if (haveAddress) {
      row.address = getAddress(row)

      delete row.name_obl
      delete row.Number_of_house
      delete row.Street
    }

    for (const key of Object.keys(row)) {

      if (row[key] === null) {
        row[key] = '-'
      }

      for (const mapping of mappings) {
        if (key === mapping.queryName && mapping.binary) {
          row[key] = row[key] === 1 ? 'Есть' : 'Нет'
        }
      }

    }

  }
}

module.exports = {
  normalizeData
}