const twilio = require("twilio");
const configJson = require("./config.json");
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const chatGrant = new ChatGrant({
    serviceSid: configJson.TWILIO_SERVICE_SID
});
const generateTwilioJwt = (identity) => {
    const token = new AccessToken(configJson.TWILIO_ACCOUNT_SID, configJson.TWILIO_API_KEY, configJson.TWILIO_API_SECRET);
    token.identity = identity;
    token.addGrant(chatGrant);
    return token;
};

exports.getTwilioJwt = (req, res) => {
    const token = generateTwilioJwt(req.body.identity);
    console.log('this is the twilio token stringified: ' + JSON.stringify(token));
    res.json({
        jwt: token.toJwt(),
        identity: token.identity
    });
};
