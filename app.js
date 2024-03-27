const express = require('express');
const fileUpload = require('express-fileupload');
const uploadController = require('./services/controllers/uploadController.js');
const getFileController = require('./services/controllers/getFileController.js');
const cors = require('cors');
require('dotenv').config();

const app = express();

// enable cors
app.use(cors());
// Middleware for file upload
app.use(fileUpload());

// Routes
app.post('/upload', uploadController.uploadFile);
app.get('/file', getFileController.getFile);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
