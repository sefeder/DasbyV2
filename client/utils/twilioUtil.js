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

getPublicKey = upi => {
    return new Promise ((resolve, reject) => {
        fetch('http://localhost:3000/services/virgil-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ identity: upi })
        })
        .then(res => res.json())
        .then(virgilCard => {
            const publicKey = cardManager.importCardFromJson(virgilCard).publicKey
            console.log('publicKey: ', publicKey)
            resolve(publicKey)   
        })
    })
}


createChannel = (chatClient, userUpi, adminUpi) => {
    console.log('createChannel is hitting')
    const channelName = userUpi;
    return new Promise((resolve,reject) => {
    //Get admin public key before creating channel
        getPublicKey(adminUpi)
        .then(adminPublicKey => {
            // now get user's public key and generate chat channel
            getPublicKey(userUpi)
            .then(userPublicKey => {
                const channelKeyPair = virgilCrypto.generateKeys();
                const channelPrivateKeyBytes = virgilCrypto.exportPrivateKey(channelKeyPair.privateKey);
                const encryptedChannelPrivateKeyBytes = virgilCrypto.encrypt(
                    channelPrivateKeyBytes,
                    // next line is array of all channel members' public keys. Here it just the creator's
                    [userPublicKey, adminPublicKey]
                );
                console.log('creating new channel')
                chatClient
                    .createChannel({
                        uniqueName: channelName, friendlyName: channelName, attributes: {
                            privateKey: encryptedChannelPrivateKeyBytes.toString('base64')
                        }
                    })
                    .then(channel => {
                        console.log('newly created channel: ', channel)
                        resolve(channel)
                    })
                    .catch(err => console.log(err))  
            })
        })                 
    })
}

    getTwilioToken = upi => { 
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
    }

    createChatClient = token => {
        return new Promise((resolve, reject) => {
            resolve(Chat.Client.create(token.jwt))
        })
    }

    findChannel = (chatClient, channelName) => {
        return new Promise((resolve, reject) => {
            chatClient.getChannelByUniqueName(channelName)
            .then(channel => {
                console.log('newly found channel: ', channel)
                resolve(channel)
            })
        })
    }

    joinChannel = channel => {
        console.log('joinChannel is hitting')
        return channel.join()
       
    }

    getAllChannels = chatClient => {
        return new Promise((resolve, reject) => {
           resolve(chatClient.getUserChannelDescriptors()) 
        })
    }

    consoleLogging = logThis => {
        console.log(logThis)
    }

//--------------------------Comment Out to Create Admin---------------------------------
    addAdminToChannel = userUpi => {
        return new Promise((resolve, reject) => {
        // adminUpi is hardcoded for now - will need to find way of doing this progromatically in future and added as parameter to function above
       getTwilioToken("OE08fM64qx")
            .then(createChatClient)
            .then(adminChatClient => {
                findChannel(adminChatClient, userUpi)
                .then(joinChannel)
                .then(channel => {
                    console.log('admin successfully joined channel')
                    resolve(channel)
                })
            })
        })
    }
//--------------------------Comment Out to Create Admin---------------------------------
   

export default {
    createChannel: createChannel,
    getTwilioToken: getTwilioToken,
    createChatClient: createChatClient,
    joinChannel: joinChannel,
    getAllChannels: getAllChannels,
    consoleLogging: consoleLogging,
    addAdminToChannel: addAdminToChannel,
    findChannel: findChannel
}