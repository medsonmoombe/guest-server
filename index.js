const express = require('express');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const helmet = require("helmet");

const app = express();

// Middleware for file upload
app.use(fileUpload());

app.use(helmet());
module.exports = app;