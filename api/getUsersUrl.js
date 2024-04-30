const app = require('../index')

const route = require('../routes/getUsersUrl')

app.use('/api/', route)

module.exports = app