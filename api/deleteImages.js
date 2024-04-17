const app = require('../index')

const route = require('../routes/deleteImagesToS3')

app.use('/api/', route)


module.exports = app