const twilio = require('./dasbyTwilio')
const virgil = require('./dasbyVirgil')
const dasbyUpi = '5L9jVNof2r'

const sendResponse = (channel) => {
    console.log('send response hit!!!')
    channel.sendMessage(virgil.encryptMessage(channel, '{ "message": "Yes, it\'s me Dasby, pleased to meet you." }'))
}

handleNewMessage = (channelSid, body, author) => {
    if (author !== dasbyUpi) {
        twilio.getChannelAsDasby(dasbyUpi, channelSid)
            .then(currentChannel =>{
                console.log("handleNewMessage currentChannel: ", currentChannel)
                const decryptedMessage = virgil.decryptMessage(currentChannel, body)
                console.log('decryptedMessage: ', decryptedMessage)
                sendResponse(currentChannel);
            })
    }
}

module.exports = {
    handleNewMessage: handleNewMessage
}