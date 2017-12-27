   
   
   var service = require("../services/activitiesService")

module.exports.search_byprojectid_activities = function(req, res) {
  var module_id = req.body.module_id;
  var project_id = req.body.project_id;
  service.search_byprojectid_activities(module_id,project_id,function (data){
    res.json(data);
  });
}
// module.exports.delete_JsReport = function(req, res) {
//   var module_id = parseInt(req.params[0], 10);
//   service.delete_JsReport(module_id,function (){
//     res.status(204);
//     res.end();
//   });
// }
// module.exports.get_all_Fulltest = function(req, res) {
//   var fulltest_id = req.query.id;

//   service.get_all_Fulltest(function (fulltest){
//     res.json(fulltest);
//   });
// }