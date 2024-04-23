const app = require('../index')

const route = require('../routes/deleteDisplayImages')

app.use('/api/', route)


module.exports = app