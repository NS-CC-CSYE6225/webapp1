const readCSV = require("./services/userService");
const express = require("express");
const config = require("./config/config");
const router = require("./routes/assignmentsRoute");
const db = require("./models/index");
// const { route } = require("./routes/assignmentsRoute");

const app = express();

// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize(config);
// const mysql2 = require('mysql2/promise');



// Express route to check the database connection
app.get('/healthz', (req, res) => {
  db.sequelize
  .authenticate()
  .then(() => {
    res.status(200).send();
  })
  .catch(() => {
    res.status(503).send();
  })
});


app.use('/v1/assignments', router);

// app.get('/v1/assignments', router);

// app.put('/v1/assignments/:id', router);

// app.delete('/v1/assignments/:id', router);

// Start the Express server
app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});

readCSV;

