import express from 'express'
import config from 'config'
import path from 'path'

const app = express()
const __dirname = path.resolve()

// import apiAuth from'./routes/auth.routes.js'
import apiMap from './routes/map.routes.js'
import apiMapFilter from './routes/filter.routes.js'
import apiMapSingle from './routes/single.routes.js'
import apiView from './routes/view.routes.js'
import apiReports from './routes/reports.routes.js'
import apiReportsArea from './routes/area.routes.js'
import apiReportsPDF from './routes/pdf.routes.js'

app.use(express.json({extended: true}))

// app.use('/api/auth', apiAuth)

app.use('/api/map', apiMap)
app.use('/api/map/filter', apiMapFilter)
app.use('/api/map/single', apiMapSingle)

app.use('/api/view', apiView)

app.use('/api/reports', apiReports)
app.use('/api/reports/area', apiReportsArea)
app.use('/api/reports/pdf', apiReportsPDF)

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

app.listen(PORT, () => console.log(`Server has been started on port ${PORT} ...`))

/*
alias node='/home/c/cm74536/nodejs/bin/node'

alias npm='/home/c/cm74536/nodejs/bin/npm'

export PATH=$PATH:/home/c/cm74536/nodejs/bin/


alias git='/home/c/cm74536/nodejs/bin/node'

export PATH=$PATH:/home/c/cm74536/nodejs/bin/

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCENwMwLKpJSa4ac3EG4JNocjMpMQuS/iyNYvovvkgclisGPrPKCMYU2SvisNuNK8z1vz/+IyEJAmFmCDBFmkz+qngKFj24p8U2EnBh/S3p7jXpeL/tAvgaxv+5nknfN2xXXHb/iI9Y54V8iJX+TmTCB9yijJsQ5KgUc3pbQic7G5bksM+4aqJGUieY1CUy2kzXwcemG8b1akcpkUWXwftfzjthjrdjIuXUgIi5u8xFZ8U9tenb5zpAlZfAmYZ7XeXbjFh0YC0met3sTL9FvyIFMjIUPAOFybanM91GA5g3YdTmZucJFR9nfCDfurqGNyreYDAfDpDkXOl5ERjU9iu9 rsa-key-20210515

 */