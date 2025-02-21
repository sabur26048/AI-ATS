var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
require("dotenv").config();
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

// ✅ Improved CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Replace with frontend URL if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle Preflight Requests (Important for CORS)
app.options("*", cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Serve React Build (Uncomment if needed)
 const buildPath = path.join(__dirname, "..","helper","build");
 app.use(express.static(buildPath));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Handle 404 Errors
app.use(function (req, res, next) {
  next(createError(404));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;
