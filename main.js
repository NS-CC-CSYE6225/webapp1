const express = require('express');
const app = express();

const assignmentRouter = require("./routes/assignmentsRoute");
const healthzRouter = require("./routes/healthzRoute");

app.use('/v1/assignments', assignmentRouter);

app.use('/healthz', healthzRouter);


module.exports = app