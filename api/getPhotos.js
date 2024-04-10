const app = require('../index')

const route = require('../routes/getAllimagesFromS3')

app.use('/api/', route)

// export 
module.exports = app