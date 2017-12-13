//app.js
require('dotenv').load();
const express = require('express')
const app = express()
const fs = require('fs')
var session = require('express-session')
const queryParser = require('query-parser')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

app.use(session({
    secret: process.env.secret,
    resave: true,
    saveUnitialized: true
}));

const pg = require('pg')
const Client = pg.Client

const client = new Client({
    user: process.env.user,
    host: 'localhost',
    database: process.env.database,
    password: process.env.password,
    port: 5432,
})

client.connect()
app.use(bodyParser.urlencoded())
app.set('view engine', 'pug')
require("./login.js")(app, client)
require("./addMessages.js")(app, client)
require("./allMessages.js")(app, client)
require("./ownMessages.js")(app, client)
require("./logout.js")(app)
require("./comment.js")(app, client)

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(80, () => {
    console.log("listening")
})
