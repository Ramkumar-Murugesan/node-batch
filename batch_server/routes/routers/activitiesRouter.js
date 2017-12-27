var express = require("express");
var router = express.Router();
var controller = require("../../controllers/activitiesController")
 router.post("/getbyprojectid", controller.search_byprojectid_activities);
//router.get(/^\/getbyprojectid\/(\d+)$/, controller.search_byprojectid_activities);
//router.put("/Fulltest", controller.update_Fulltest);
// router.delete(/^\/delete_report\/(\d+)$/, controller.delete_JsReport);
//router.get("/Fulltest", controller.get_all_Fulltest);

module.exports = router;