require('dotenv').config()
const twilio = require("twilio");
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID
});
const generateTwilioJwt = (identity) => {
    console.log('identity from twilio in routes: ', identity)
    console.log('accountSid: ', process.env.TWILIO_ACCOUNT_SID)
    const token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
    token.identity = identity;
    token.addGrant(chatGrant);
    console.log('token from twilio in routes: ', token)
    return token;
};

getTwilioJwt = (req, res) => {
    const token = generateTwilioJwt(req.body.identity);
    res.json({
        jwt: token.toJwt(),
        identity: token.identity
    });
};

module.exports = {
    generateTwilioJwt: generateTwilioJwt,
    getTwilioJwt: getTwilioJwt
}