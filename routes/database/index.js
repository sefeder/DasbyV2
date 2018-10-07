const router = require("express").Router();
const userRoutes = require("./userRoutes");
const dialogueRoutes = require("./dialogueRoutes");

router.use("/users", userRoutes);
router.use("/dialogue", dialogueRoutes);

module.exports = router;