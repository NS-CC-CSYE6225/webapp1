const express = require('express');
const app = express();

const assignmentRouter = require("./routes/assignmentsRoute");
const healthzRouter = require("./routes/healthzRoute");

app.use('/demo/assignments', assignmentRouter);

app.use('/healthz', healthzRouter);

// app.use('/', (req, res) => {
//     res.status(200).send(); // Sending 'OK' with a 200 status code
//   });
//

app.use('/', (req, res , next) => {
  if(req.path === '/'){
      res.status(200).end();

  }else{
      next();
  }
});

// Handle all other routes with a 404 response
app.use('*', (req, res) => {
    res.status(404).end();
});

module.exports = app