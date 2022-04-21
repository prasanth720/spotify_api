
require("dotenv").config();
require("express-async-errors");
const express = require("express");
connection = require('./db')
const app = express();
const bodyparser = require('body-parser')
const cors = require("cors")
const route = require('./router/route')
app.use(cors());
app.use(cors({ options: process.env.CORS_OPTIONS }));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/spotify', route);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening on port ${port}....`) })
module.exports = app;




