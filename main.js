const express = require('express');
const app = express();

const assignmentRouter = require("./routes/assignmentsRoute");
const healthzRouter = require("./routes/healthzRoute");

app.use('/v1/assignments', assignmentRouter);

app.use('/healthz', healthzRouter);

app.use('/', (req, res) => {
    res.status(200).send(); // Sending 'OK' with a 200 status code
  });

module.exports = app