const router = require("express").Router();
const userController = require("../../controllers/userController");

router.route("/createNewUser")
    .post(userController.create)

router.route("/logIn")
    .post(userController.authenticateUser)

router.route("/update")
    .post(userController.update)

router.route("/get-user")
    .post(userController.getUser)

router.route('/get-admin')
    .get(userController.getAdmin)

module.exports = router;
