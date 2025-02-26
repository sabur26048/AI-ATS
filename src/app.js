var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var indexRouter = require("./routes/AI-ATS");
var usersRouter = require("./routes/users");
var app = express();
require("dotenv").config();
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); const buildPath = path.join(__dirname, "..", "helper", "build");
app.use(express.static(buildPath));
app.use("/user", cors(),usersRouter);
app.use("/AI-ATS", indexRouter);


app.use(function (req, res, next) {
  next(createError(404));
});
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


module.exports = app ;
