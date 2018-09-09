const Chat = require('twilio-chat')
const vCrypto = require('virgil-crypto')

import { VirgilCrypto, VirgilCardCrypto } from 'virgil-crypto'
import { CardManager, VirgilCardVerifier, CachingJwtProvider, KeyStorage } from 'virgil-sdk';
import { resolve } from 'url';
const virgilCrypto = new VirgilCrypto();
const virgilCardCrypto = new VirgilCardCrypto(virgilCrypto);
const cardManager = new CardManager({
    cardCrypto: virgilCardCrypto,
    cardVerifier: new VirgilCardVerifier(virgilCardCrypto)
});

getAdminPublicKey = adminUpi => {
    return (
        fetch('http://localhost:3000/services/virgil-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ identity: adminUpi })
        })
    )
}


createChannel = (chatClient, upi, adminUpi) => {
    console.log('createChannel is hitting')
    const channelName = upi;
    return new Promise((resolve,reject) => {

    
    //Get admin public key before creating channel
//--------------------------Comment Out to Create Admin---------------------------------
    return getAdminPublicKey(adminUpi)
        .then(res => res.json())
        .then(adminCard => {
            adminVrigilCardObject = cardManager.importCardFromJson(adminCard)
            const adminPublicKey = adminVrigilCardObject.publicKey
            console.log('adminPublicKey: ', adminPublicKey)
//--------------------------Comment Out to Create Admin---------------------------------

            // now get user's public key and generate chat cahnnel
            return fetch('http://localhost:3000/services/virgil-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ identity: upi })
            })
                .then(res => res.json())
                .then(userCards => {
                    console.log('cards: ', userCards)
                    userVrigilCardObject = cardManager.importCardFromJson(userCards)
                    const userPublicKey = userVrigilCardObject.publicKey
                    console.log('userVirgilCardObject: ', userVrigilCardObject)
                    console.log('userPublicKey: ', userPublicKey)
                    // return new Promise((resolve, reject) => {
                        const channelKeyPair = virgilCrypto.generateKeys();
                        const channelPrivateKeyBytes = virgilCrypto.exportPrivateKey(channelKeyPair.privateKey);
                        const encryptedChannelPrivateKeyBytes = virgilCrypto.encrypt(
                            channelPrivateKeyBytes,
                            // next line is array of all channel members' public keys. Here it just the creator's
                            [userPublicKey] //+++++++++++++ add in adminPublicKey ++++++++++++++
                        );
                        console.log('creating new channel')
                        // this.addMessage({ body: `Creating ${this.state.channelInput} channel...` })
                        return chatClient
                            .createChannel({
                                uniqueName: channelName, friendlyName: channelName, attributes: {
                                    privateKey: encryptedChannelPrivateKeyBytes.toString('base64')
                                }
                            })
                            .then(() => module.exports.joinChannel(chatClient, channelName))
                            .catch(err => console.log(err))
                    // })
                })
                .catch(err => console.log(err))
//--------------------------Comment Out to Create Admin---------------------------------
    })
    .catch(err => console.log(err))
//--------------------------Comment Out to Create Admin---------------------------------
    })
    

}





module.exports =  {
    getTwilioToken: upi => { 
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/services/get-twilio-jwt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ identity: upi })
            })
            .then(res => res.json())
            .then((token) => {
                console.log('this is the token identity: ' + token.identity)
                resolve(token)
            })
            .catch(() => {
                reject(Error("Failed to connect."))
            })
        })
    },
    createChatClient: token => {
        return new Promise((resolve, reject) => {
            resolve(Chat.Client.create(token.jwt))
        })
    },
    joinChannel: (chatClient, userUpi) => {
        console.log('joinChannel is hitting')
        const channelName = userUpi;
        return new Promise((resolve, reject) => {
            return chatClient.getChannelByUniqueName(channelName)
                .then(channel => {
                    console.log('channel found!')
                    console.log(channel)
                    // this.addMessage({ body: `Joining ${channel.sid} channel...` })
                    // this.setState({ channel: channel })

                    return channel.join()
                        .then(() => {
                        console.log('joined channel successfully!')
                            resolve(channel)
                        // this.addMessage({ body: `Joined ${channelName} channel as ${this.state.username}` })
                        // window.addEventListener('beforeunload', () => channel.leave())
                        })
                        .catch(() => reject(Error(`Could not join ${channelName} channel.`)))

                    console.log("outside of channel.join")
                    console.log("channel inside join channel: ", channel)
                    
                    // adminUpi is hardcoded for now - will need to find way of doing this progromatically in future
                })
                .catch(() => createChannel(chatClient, userUpi, "OE08fM64qx"))
        })
    },

    getAllChannels: chatClient => {
        return new Promise((resolve, reject) => {
           resolve(chatClient.getUserChannelDescriptors()) 
        })
    },
    consoleLogging: logThis => {
        console.log(logThis)
    },

//--------------------------Comment Out to Create Admin---------------------------------
    addAdminToChannel: (userUpi) => {
        // adminUpi is hardcoded for now - will need to find way of doing this progromatically in future and added as parameter to function above
        exports.getTwilioToken("OE08fM64qx")
            .then(exports.createChatClient)
            .then(adminChatClient => {
                return exports.joinChannel(adminChatClient, userUpi)
            })
    }
//--------------------------Comment Out to Create Admin---------------------------------
   
}