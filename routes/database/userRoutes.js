const router = require("express").Router();
const userController = require("../../controllers/userController");
router.route("/createNewUser")
    .post(userController.create)

module.exports = router;