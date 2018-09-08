const Chat = require('twilio-chat')
const vCrypto = require('virgil-crypto')

export default {
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
    joinChannel: (chatClient, upi) => {
        const channelName = upi;
        return new Promise((resolve, reject) => {
            chatClient.getChannelByUniqueName(channelName)
                .then(channel => {
                    console.log('channel found!')
                    console.log(channel)
                    // this.addMessage({ body: `Joining ${channel.sid} channel...` })
                    // this.setState({ channel: channel })

                    channel.join().then(() => {
                        console.log('joined channel successfully!')
                        // this.addMessage({ body: `Joined ${channelName} channel as ${this.state.username}` })
                        // window.addEventListener('beforeunload', () => channel.leave())
                    }).catch(() => reject(Error(`Could not join ${channelName} channel.`)))

                    resolve(channel)
                }).catch(() => createChannel(chatClient, upi))
            }).catch(() => reject(Error('Could not get channel list.')))
    },
    createChannel: (chatClient, upi) => {
        const channelName = upi;
        fetch('http://localhost:3000/services/virgil-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ identity: upi })
        })
            .then(res => res.json())
            .then(card => {
                const virgilCrypto = new vCrypto.VirgilCrypto();
                return new Promise((resolve, reject) => {
                    const channelKeyPair = virgilCrypto.generateKeys();
                    const channelPrivateKeyBytes = virgilCrypto.exportPrivateKey(channelKeyPair.privateKey);
                    const encryptedChannelPrivateKeyBytes = virgilCrypto.encrypt(
                        channelPrivateKeyBytes,
                        // next line is array of all channel members' public keys. Here it just the creator's
                        [card.publicKey, {
                            "identifier": {
                                "type": "Buffer",
                                "data": [
                                    226,
                                    21,
                                    50,
                                    150,
                                    167,
                                    19,
                                    164,
                                    198
                                ]
                            },
                            "key": {
                                "type": "Buffer",
                                "data": [
                                    48,
                                    42,
                                    48,
                                    5,
                                    6,
                                    3,
                                    43,
                                    101,
                                    112,
                                    3,
                                    33,
                                    0,
                                    225,
                                    94,
                                    199,
                                    15,
                                    94,
                                    1,
                                    225,
                                    217,
                                    211,
                                    58,
                                    1,
                                    38,
                                    210,
                                    116,
                                    66,
                                    108,
                                    69,
                                    161,
                                    10,
                                    168,
                                    187,
                                    210,
                                    250,
                                    208,
                                    116,
                                    107,
                                    79,
                                    88,
                                    153,
                                    160,
                                    215,
                                    192
                                ]
                            }
                        }
                        ]
                    );
                    console.log('creating new channel')
                    // this.addMessage({ body: `Creating ${this.state.channelInput} channel...` })
                    chatClient
                        .createChannel({
                            uniqueName: channelName, friendlyName: channelName, attributes: {
                                privateKey: encryptedChannelPrivateKeyBytes.toString('base64')
                            }
                        })
                        .then(() => joinChannel(chatClient))
                        .catch(() => reject(Error(`Could not create channel.`)))
                })
            })
        
    }
}