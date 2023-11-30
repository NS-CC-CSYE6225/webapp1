const { DataTypes } = require('sequelize');
// const { sequelize } = require('../models/index');
const db = require('../models/index');


  const Submit = db.sequelize.define('submission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

    submission_url:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true
      }
    },
    submission_date:{
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
          notEmpty: true
      }
    },
    submission_updated:{
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
          notEmpty: true
      }
    },
    assignment_id:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
      },
      user_id:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
      }
  
  });

  module.exports = { Submit };