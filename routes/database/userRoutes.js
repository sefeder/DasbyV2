const router = require("express").Router();
const userController = require("../../controllers/userController");

router.route("/createNewUser")
    .post(userController.create)

router.route("/logIn")
    .post(userController.authenticateUser)

router.route("/update")
    .post(userController.update)

module.exports = router;
