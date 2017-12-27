var models = require("../models");
var sequelize = models.sequelize;
var PropertiesReader = require('properties-reader');
var sqlQuery = PropertiesReader(__dirname+'/../sql_queries/activities_SQL.properties');
module.exports.create_JsReport = function(moduleReport,callback) {
  var create_query = sqlQuery._properties.create_JsReport;
  sequelize.query(create_query, {
    replacements: {
    	name : moduleReport.name,
      label : moduleReport.label,
      description : moduleReport.description,
      create_date : moduleReport.create_date,
      create_by : moduleReport.create_by,
      last_modified_date : moduleReport.last_modified_date,
      last_modified_by : moduleReport.last_modified_by,
      projectid : moduleReport.projectid,
      base_location : moduleReport.base_location,
      predefined_activity_id : moduleReport.predefined_activity_id
    },
    type : sequelize.QueryTypes.INSERT,
    model: models.activities
  }).then(function(moduleReport) {
		callback(moduleReport);
	});
}
// module.exports.update_Fulltest = function(Fulltest,callback) {
//   var update_query = sqlQuery._properties.update_Fulltest;
//   sequelize.query(update_query, {
//     replacements: {
//     	id : Fulltest.id,
//     	name : Fulltest.name,
//     	age : Fulltest.age,
//     	updated_by : 0
//     },
//     type : sequelize.QueryTypes.BULKUPDATE,
//     model: models.Fulltest
//   }).then(function(fulltest) {
// 		callback(fulltest);
// 	});
// }
module.exports.search_byprojectid_activities = function(project_id,callback) {
  console.log("get dao---->>>>",project_id);
  var search_for_update_query = sqlQuery._properties.search_byprojectid_activities;
  sequelize.query(search_for_update_query, {
    replacements: {
    	projectid: project_id
    },
    type : sequelize.QueryTypes.SELECT,
    model: models.activities
  }).then(function(moduleReport) {
   // console.log("after getting values in dao",moduleReport)
    //console.log("after getting values of zero in dao",moduleReport[0])
		callback(moduleReport);
	});
}
// module.exports.delete_JsReport = function(module_id,callback) {
//   console.log("delete dao---->>>>",module_id);
//   var delete_query = sqlQuery._properties.delete_JsReport;
//   sequelize.query(delete_query, {
//     replacements: {
//     	id: module_id
//     },
//     type : sequelize.QueryTypes.DELETE,
//     model: models.activities
//   }).then(function() {
// 		callback();
// 	});
// }
// module.exports.get_all_Fulltest = function(callback) {
//   var get_all_query = sqlQuery._properties.get_all_Fulltest;
//   sequelize.query(get_all_query, {
//     type : sequelize.QueryTypes.SELECT,
//     model: models.Fulltest
//   }).then(function(fulltest) {
// 		callback(fulltest);
// 	});
// }