var express = require("express");
var http = require("http");
var path = require("path");
var models = require("./models");
var router = require("./routes/routes");
var logger = require("morgan");
var bodyParser = require('body-parser');
var app = express();
var clientPath = path.resolve(__dirname, "client");

app.use(bodyParser.json({limit: '50mb'}))
app.use(logger("dev"));
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Content-Length, Authorization, X-Requested-With, X-XSRF-TOKEN");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if ( req.method === 'OPTIONS' ) {
    console.log('OPTIONS SUCCESS');
    res.end();
  }
  next();
});


app.use("/",express.static(clientPath));
app.use("/api", router);
app.all('*', function (req, res) { 
  res.status(200).sendFile(path.join(__dirname, '/client/index.html')); 
});


models.sequelize.sync().then(function () {
  var server = app.listen(8000, function() {
  console.log('Express server listening on port ' + server.address().port);
  });
});