const express = require('express');
const router = express.Router();
const db = require("../models");
const log = require("../CloudWatch/logger");
const sd = require("../CloudWatch/statsd");

// Express route to check the database connection
router.get('/', (req, res) => {
    log.logger.info("Healthz started");
    sd.statsdClient.increment("Healthz counter");
    db.sequelize
    .authenticate()
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(503).send();
    })
  });

module.exports = router;