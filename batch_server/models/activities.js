'use strict';

module.exports = function(sequelize, DataTypes) {
  var activities = sequelize.define("activities", {
    id: {
    	type : DataTypes.INTEGER,
    	primaryKey : true,
    	autoIncrement : true
    },
    name:DataTypes.STRING,
    label:DataTypes.STRING,
    description:DataTypes.STRING,
    
    projectid:DataTypes.INTEGER,
    moduleid: DataTypes.INTEGER,
    notes:DataTypes.STRING,
    primary_noun_id: DataTypes.INTEGER,
    activity_types: DataTypes.STRING,
    created_date: DataTypes.INTEGER,
    secondary_nouns : DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    last_modified_date:DataTypes.INTEGER,
    last_modified_by:DataTypes.INTEGER,
    location_logic:DataTypes.STRING,
    processing_context:DataTypes.STRING,
    master_flow_id:DataTypes.INTEGER,
    supported_verbs:DataTypes.STRING,
    module_type:DataTypes.STRING,
    predefined_activity_id:DataTypes.INTEGER,
  wsdl_id:DataTypes.INTEGER,
  rest_api_id:DataTypes.INTEGER
  },{
    createdAt: false, 
    updatedAt: false,
    freezeTableName:true
  });
  return activities;
};