const { DataTypes } = require('sequelize');
// const { sequelize } = require('../models/index');
const db = require('../models/index');


  const Assignment = db.sequelize.define('assignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          min: 1, 
          max: 10,
      }
    },
    num_of_attemps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true
      }
  }
  
  },{
    assignment_created: 'Assignment_created',
    assignment_updated: 'Assignment_updated',
    primaryKey: false
    
  });


module.exports = { Assignment };


