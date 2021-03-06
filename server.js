// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
// const ENV        = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
const home = require("./routes/home");
const login = require("./routes/login");
const logout = require("./routes/logout");
const register = require("./routes/register");
const restaurant = require("./routes/restaurant");
const browse = require("./routes/browse.js");
const history = require("./routes/history");
const cart = require("./routes/cart");
const sms = require("./routes/sms");

// Mount all resource routes
app.use("/home", home(db));
app.use("/login", login(db));
app.use("/logout", logout());
app.use("/register", register(db));
app.use("/restaurant", restaurant(db));
app.use("/browse", browse(db));
app.use("/history", history(db));
app.use("/cart", cart(db));
app.use("/sms", sms(db));
app.use("/", home(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
