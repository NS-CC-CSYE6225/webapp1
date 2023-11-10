const express = require('express');
const router = express.Router();
const db = require("../models");
const logger = require("../CloudWatch/logger").logger;
const sd = require("../CloudWatch/statsd").statsdClient;
// const { log } = require('winston');

// Express route to check the database connection
router.get('/', (req, res) => {
    
    sd.statsdClient.increment("Healthz counter");
    db.sequelize
    .authenticate()
    .then(() => {
      logger.info("INFO: Fetched all assignments (HTTP Status: 200 OK)");
      res.status(200).send();
    })
    .catch(() => {
      // logger.error("503");
      logger.error("ERROR: Service is unavailable (HTTP Status: 503 SERVICE UNAVAILABLE)");
      res.status(503).send();
    })
  });

module.exports = router;