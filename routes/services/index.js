const router = require("express").Router();

const twilioService = require("./twilio");
const virgilService = require("./virgil");
const catmh = require("./catmh");

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
router.route('/get-catmh-survey')
    .post((req,res)=>{
        catmh.getSurvey(req.body.surveyType, req.body.userUpi)
        .then(firstQ => {res.send(firstQ)})
    });

module.exports = router;