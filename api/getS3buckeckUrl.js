const app = require('../index')

const route = require('../routes/getS3buckeckUrl')

app.use('/api/', route)

module.exports = app