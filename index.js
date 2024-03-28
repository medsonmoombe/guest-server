const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();
const helmet = require("helmet");

const app = express();

// enable cors
app.use(cors());
// Middleware for file upload
app.use(fileUpload());

app.use(helmet());
module.exports = app;