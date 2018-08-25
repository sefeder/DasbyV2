const router = require("express").Router();

const signIn = require("../controllers/signIn");
const signUp = require("../controllers/signUp");
const getTwilioJwt = require("./twilio");
const getVirgilJwt = require("./virgil");

router.post('/signin', signIn.signIn);
router.post('/signup', signUp.signUp);
router.post('/get-virgil-jwt', getVirgilJwt.getVirgilJwt);
router.post('/get-twilio-jwt',  getTwilioJwt.getTwilioJwt);
exports.default = router;