const app = require('../app')

const route = require('../routes/getFile')

app.use('/api/', route)


module.exports = app