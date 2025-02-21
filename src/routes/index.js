var express = require('express');
var router = express.Router();
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Welcome = require("../views/index").default;

router.get('/', function(req, res, next) {
  const name = req.query.name || "Guest"; 
  const html = ReactDOMServer.renderToString(React.createElement(Welcome, { name })); 
  res.send(`<!DOCTYPE html>${html}`);
});

module.exports = router;
