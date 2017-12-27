

var models = require("../models");
var sequelize = models.sequelize;
var PropertiesReader = require('properties-reader');
var sqlQuery = PropertiesReader(__dirname+'/../sql_queries/activities_SQL.properties');








module.exports.search_bymoduleid_predefined_activities = function(module_id,callback) {
    console.log("get dao---->>>>",module_id);
    var search_for_update_query = sqlQuery._properties.search_bymoduleid_predefined_activities;
    sequelize.query(search_for_update_query, {
      replacements: {
          id: module_id
      },
      type : sequelize.QueryTypes.SELECT,
      model: models.predefined_activites
    }).then(function(moduleReport) {
        //console.log("final last values in dao-->>>",moduleReport);
          callback(moduleReport[0]);
      });
  }