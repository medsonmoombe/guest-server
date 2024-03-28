const app = require('../app')

const route = require('../routes/upload')

app.use('/api/', route)

module.exports = app