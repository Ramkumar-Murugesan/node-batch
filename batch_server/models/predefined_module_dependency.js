'use strict'

module.exports = function(sequelize , DataTypes){
    var predefined_module_dependency = sequelize.define("predefined_module_dependency",{

 id:{
     type:DataTypes.INTEGER,
     primaryKey:true,
     autoIncrement:true
 },
 predefined_activities_id:DataTypes.INTEGER,
 dependency:DataTypes.INTEGER


    });
    return predefined_module_dependency;
}