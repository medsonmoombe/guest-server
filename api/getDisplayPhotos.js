const app = require('../index')

const route = require('../routes/getDisplayImages')

app.use('/api/', route)

// export 
module.exports = app