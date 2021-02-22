const fs = require('fs')

let stream = fs.createReadStream('data/names.txt', 'utf8')

const read = (input, file) => {
  let remaining = '', obj = null, list = []
  const result = []

  input.on('data', (data) => {
    remaining += data

    let index = remaining.indexOf('\n')

    while (index > -1) {

      let line = remaining.substring(0, index)

      remaining = remaining.substring(index + 1)

      line = line.trim()

      if (line.length > 0) {

        if (line[0] === '!') {

          if (obj != null) {
            obj.data = list

            result.push(obj)

          }

          obj = {
            'name': line.substr(1, line.length - 1),
            'data': {}
          }

          list = []

        } else {
          list.push(line)
        }

      }

      index = remaining.indexOf('\n')

    }

  })

  input.on('end', () => {
    file.end(JSON.stringify(result, null, 2))
  })
}

let file = fs.createWriteStream('info.json')

console.log(read(stream, file))