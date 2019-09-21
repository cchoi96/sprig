// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
const home = require('./routes/home');
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const browse = require('./routes/browse.js');
const user = require('./routes/user');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/login", login(db));
app.use("/logout", logout());
app.use("/register", register(db));
app.use("/", home(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
