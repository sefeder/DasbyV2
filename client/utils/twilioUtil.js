
const Chat = require('twilio-chat')

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
    // joinChannel: 
}