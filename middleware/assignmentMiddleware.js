const { findPwd } = require("../services/assignmentsService");
const bcrypt = require('bcrypt');

// Middleware for authenticating users based on tokens
const authenticateUser = (req, res, next) => {
    const userToken = req.headers.authorization;

    if (!userToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const fields = Buffer.from(userToken.split(' ')[1], 'base64').toString().split(':');
    const username = fields[0];
    const password = fields[1];
    console.log(">>>>>>>>>>>>>"+ username);
    findPwd(username).then((Pwd) => {
      bcrypt.compare(password, Pwd, (err, result) => {
            if (err) {
                // Handle error
                console.error(err);
                return res.status(401).send('Authorization Error'); 
            } else {
                if (result) {
                    // Passwords match
                    console.log('Authorized!');
                    return next();
                } else {
                    // Passwords do not match
                    console.log('Wrong Password');
                    return res.status(401).send('Password Error');
                }
            }
      });
    }).catch((error) => {
      console.error('Unauthorized', error);
      return res.status(401).send('Catch Authorization Error');
    });


  };

  module.exports = authenticateUser;