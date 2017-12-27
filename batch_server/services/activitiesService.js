var activities_dao = require("../daos/activities")
var predefined_activity_dao = require("../daos/predefined_activites");
var predefined_dependency_dao = require("../daos/predefined_module_dependency");
var async = require('async');

module.exports.search_byprojectid_activities = function(module_id,project_id,callback) {
  var full_predefined_value = [];
  var report_status ;
  activities_dao.search_byprojectid_activities(project_id,function (projectReport){
    predefined_dependency_dao.search_bypredefinedid_dependency(module_id,function(predefined_activities){
     async.forEachOf(predefined_activities,function(value,key,callback)
      {
      predefined_activity_dao.search_bymoduleid_predefined_activities(value.dependency,function(predefined_dependency_Values){
        report_status = false;
        for(var j=0 ; j<projectReport.length ; j++){
         if(projectReport[j].predefined_activity_id == predefined_dependency_Values.id){
          report_status = true;
         }
       }
       if(report_status){
        full_predefined_value.push({name:predefined_dependency_Values.name , status:true});
        callback();
        
       }
       else{
       full_predefined_value.push({name:predefined_dependency_Values.name , status:false})
      callback();
      }
     })
    },function(err){
         if(err){
        callback(err);  
        }
          else{
          callback(full_predefined_value);
          }
        
      })
    })
  });
}