const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../models/index');

    const User = db.sequelize.define("user", {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty: true
            },
            primaryKey: true
        },
        first_name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
            const hashedPassword = bcrypt.hashSync(value, 10); 
            this.setDataValue('password', hashedPassword);
            },
            validate:{
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              notEmpty: true
            },
          }
        
    },{
        createdAt: 'account_created',
        updatedAt: 'account_updated',
        primaryKey: false    

    });


//     db.sequelize.sync()
//   .then(() => {
//     console.log('Table created successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating table:', error);
//   });

module.exports = { User };

