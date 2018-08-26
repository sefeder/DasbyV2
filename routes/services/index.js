const router = require("express").Router();

const twilioService = require("./twilio");
const virgilService = require("./virgil");

router.post('/signin', virgilService.signIn);
router.post('/signup', virgilService.signUp);
router.post('/get-virgil-jwt', virgilService.getVirgilJwt);
router.post('/get-twilio-jwt', twilioService.getTwilioJwt);

exports.default = router;