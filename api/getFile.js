const app = require('../index')

const route = require('../routes/getFile')

app.use('/api/', route)


module.exports = app