const fs = require('fs');
const csv = require('csv-parser');
const { User } = require('../models/user');
const db = require('../models');
    
function readCSV() {
    return new Promise((resolve, reject) => {
      const results = [];
  
      const stream = fs.createReadStream('/opt/users.csv')
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
}


async function createUser(userData) {
    try { 
      console.log("email is " + userData.email);
      // Check if the email already exists
      const existingUser = await db.sequelize.models.user.findOne({
        where: {
          email: userData.email,
        },
      });
  
      if (existingUser) {
        console.log('User with this email already exists. Skipping creation.');
        return;
      }

    console.log("bjf" + User);

    console.log("tjf " + userData.first_name);

  
      // If email doesn't exist, create the user
      const user = await User.create({
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: userData.password,
        email: userData.email,

      });
  
      console.log('User created with UUID:', user.toJSON());
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }



readCSV()
  .then((results) => {
    db.sequelize.sync().then(() => {
      for (let i=0; i<results.length; i++){
        console.log(results[i]);
        createUser(results[i]);
    }
    })
    
  })
  .catch((error) => {
    console.error('Error reading CSV:', error);
  });

  
module.exports = {
    readCSV
  };
  