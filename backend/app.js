require("dotenv").config(); // load .env variables

var cors = require("cors");
let cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const routes = require('./routes');

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(bodyParser.json());

//Add express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Initialize session
app.use(passport.session());

//ROUTES
app.use('/api', routes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
