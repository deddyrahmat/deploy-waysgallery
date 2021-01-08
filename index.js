const express = require('express');
const router = require('./src/routes/v1/index');

//instatiate cors module
var cors = require('cors')

const app = express();

app.use(cors())

require('dotenv').config()

// panggil route users
const router1 = require("./src/routes/v1/index");

// fungsinya menangkap data form user
app.use(express.json());

const port = 5000;

app.use("/api/v1",router1);

app.listen(port, console.log(`listening port on ${port}`));