const router = require("express").Router();
const serviceRoutes = require("./services");

// Services (twilio, virgil etc.) Routes
// router.use("/services", serviceRoutes);

// Database routes could go here
const databaseRoutes = require('./database')
router.use("/database", databaseRoutes)

module.exports = router;