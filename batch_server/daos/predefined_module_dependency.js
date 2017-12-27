var models = require("../models");
var sequelize = models.sequelize;
var PropertiesReader = require('properties-reader');
var sqlQuery = PropertiesReader(__dirname+'/../sql_queries/activities_SQL.properties');


module.exports.search_bypredefinedid_dependency = function(module_id,callback) {
    console.log("get dao---->>>>",module_id);
    var search_for_update_query = sqlQuery._properties.search_bypredefinedid_dependency;
    sequelize.query(search_for_update_query, {
      replacements: {
          id: module_id
      },
      type : sequelize.QueryTypes.SELECT,
      model: models.search_bypredefinedid_dependency
    }).then(function(moduleReport) {
          callback(moduleReport);
      });
  }