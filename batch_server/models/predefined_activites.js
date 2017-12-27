'use strict';

module.exports = function(sequelize , DataTypes){

var predefined_activities = sequelize.define("predefined_activities",{

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:DataTypes.STRING,
    label:DataTypes.STRING,
    description:DataTypes.STRING,
    location_path:DataTypes.STRING,
    activity_visibility:DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    created_date: DataTypes.INTEGER,
    last_modified_by:DataTypes.INTEGER,
    last_modified_date:DataTypes.INTEGER,
    activity_type:DataTypes.STRING,
    gcd_json : DataTypes.STRING
});

return predefined_activities;

}