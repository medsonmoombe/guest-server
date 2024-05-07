const app = require('../index')

const route = require('../routes/deleteUsersImages')

app.use('/api/', route)


module.exports = app