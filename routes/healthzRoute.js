const express = require('express');
const router = express.Router();
const db = require("../models")

// Express route to check the database connection
router.get('/', (req, res) => {
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