const app = require('../index')

const route = require('../routes/getUsersUploads')

app.use('/api/', route)

// export 
module.exports = app