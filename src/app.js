var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
require("dotenv").config();
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Allows requests from any origin
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

//const buildPath = path.join(__dirname, "..", "view", "client", "build");
//console.log("Serving static files from:", buildPath);

//app.use(express.static(buildPath));
app.use('/', indexRouter);


app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

module.exports = app;
