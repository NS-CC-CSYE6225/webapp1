const StatsD = require("hot-shots");
const logger = require("./cloudwatch-log");

const statsdClient = new StatsD({
  prefix: "webapp-service",
  // Error handler in case of async issues with the statsd server
  errorHandler: (error) => {
    logger.error("StatsD Error:", error.message);
  },
});

module.exports = statsdClient;