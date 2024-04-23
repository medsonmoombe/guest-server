const app = require('../index')

const route = require('../routes/getDisplayUrl')

app.use('/api/', route)

module.exports = app