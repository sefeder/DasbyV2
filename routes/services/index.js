const router = require("express").Router();

const twilioService = require("./twilio");
const virgilService = require("./virgil");

// router.route('/signin')
//     .post(virgilService.signIn);
router.route('/signup')
    .post(virgilService.signUp);
router.route('/get-virgil-jwt')
    .post(virgilService.getVirgilJwt);
router.route('/get-twilio-jwt')
    .post(twilioService.getTwilioJwt);
router.route('/virgil-search')
    .post(virgilService.virgilSearch);

module.exports = router;