var express = require("express");
var api = express.Router();
var routers = require("./routers")
api.use("/report", routers.activitiesRouter);

module.exports = api;