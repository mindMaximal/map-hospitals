import mappings from "../mappings.js"
import {getAddress} from "./getAddress.js";

const normalizeData = (rows, haveAddress = false) => {
  for (const row of rows) {

    if (haveAddress) {
      row.address = getAddress(row)

      delete row.region_name
      delete row.locality_name
      delete row.district_name
      delete row.number_of_house
      delete row.street
    }

    for (const key of Object.keys(row)) {

      if (row[key] === null) {

        row[key] = '-'

      } else {

        for (const mapping of mappings) {
          if (key === mapping.fullQueryName && mapping.binary) {
            row[key] = parseInt(row[key]) === 1 ? 'Есть' : 'Нет'
          }
        }

      }

    }

  }
}

export {normalizeData}