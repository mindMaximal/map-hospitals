const express = require('express')
const config = require('config')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/map', require('./routes/map.routes'))
app.use('/api/map/filter', require('./routes/filter.routes'))
app.use('/api/reports', require('./routes/reports.routes'))


const PORT = config.get('port') || 5000

app.listen(PORT, () => console.log(`Server has been started on port ${PORT} ...`))