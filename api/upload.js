const app = require('../index')

const route = require('../routes/upload')

app.use('/api/', route)

module.exports = app