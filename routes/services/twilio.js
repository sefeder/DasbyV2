require('dotenv').config()
const twilio = require("twilio");
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID
});
const generateTwilioJwt = (identity) => {
    const token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
    token.identity = identity;
    token.addGrant(chatGrant);
    return token;
};

exports.getTwilioJwt = (req, res) => {
    const token = generateTwilioJwt(req.body.identity);
    res.json({
        jwt: token.toJwt(),
        identity: token.identity
    });
};
