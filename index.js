const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();
const helmet = require("helmet");

const app = express();
const options = [
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  ];



app.use(options);


app.use(fileUpload());

app.use(helmet());
module.exports = app;