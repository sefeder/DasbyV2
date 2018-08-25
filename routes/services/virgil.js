const virgilSdk = require("virgil-sdk");
const virgilCrypto = require("virgil-crypto");
const configJson = require("./config.json");
const cardCrypto = new virgilCrypto.VirgilCardCrypto();
const cardVerifier = new virgilSdk.VirgilCardVerifier(cardCrypto);
exports.virgilCrypto = new virgilCrypto.VirgilCrypto();
exports.generator = new virgilSdk.JwtGenerator({
    appId: configJson.APP_ID,
    apiKeyId: configJson.API_KEY_ID,
    apiKey: exports.virgilCrypto.importPrivateKey(configJson.API_KEY),
    accessTokenSigner: new virgilCrypto.VirgilAccessTokenSigner(exports.virgilCrypto)
});
exports.cardManager = new virgilSdk.CardManager({
    cardCrypto: cardCrypto,
    cardVerifier: cardVerifier,
    accessTokenProvider: new virgilSdk.GeneratorJwtProvider(exports.generator),
    retryOnUnauthorized: true
});

const virgil_1 = require("../services/virgil");
exports.signIn = (req, res) => {
    return virgil_1.cardManager
        .searchCards(req.body.identity)
        .then(cards => {
            if (!cards.length) {
                return res.status(400).send("Card with this identity don't exists");
            }
            if (cards.length > 1) {
                return res.status(400).send("There are more then one card with this identity");
            }
            res.json({
                virgil_card: virgil_1.cardManager.exportCardAsJson(cards[0])
            });
        });
};
exports.signUp = (req, res) => {
    let reqCard = req.body.rawCard;
    if (typeof reqCard === "string") {
        // if card sent in JSON string representation
        reqCard = JSON.parse(reqCard);
    }
    // we can publish rawCard created on client and than client can use his
    // private key to sign and encrypt information
    const rawCard = virgil_sdk_1.RawSignedModel.fromJson(reqCard);
    const identity = JSON.parse(rawCard.contentSnapshot.toString()).identity;
    return virgil_1.cardManager
        .searchCards(identity)
        .then(cards => {
            if (cards.length > 0) {
                return res.status(400).send("Card with this identity already exists");
            }
            // then we publish it and return to client as JSON
            return virgil_1.cardManager.publishRawCard(rawCard).then(card => res.json({
                virgil_card: virgil_1.cardManager.exportCardAsJson(card)
            }));
        })
        .catch(() => res.status(500));
};
