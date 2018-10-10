const twilio = require('./dasbyTwilio')
const virgil = require('./dasbyVirgil')
const dialogue = require('../models/dialogue')

const dasbyUpi = '5L9jVNof2r'

const sendResponse = (channel, message) => {
    console.log('send response hit!!!')
    channel.sendMessage(virgil.encryptMessage(channel, message))
}

handleNewMessage = (channelSid, body, author) => {
    if (author !== dasbyUpi) {
        twilio.getChannelAsDasby(dasbyUpi, channelSid)
            .then(currentChannel =>{
                console.log("handleNewMessage currentChannel: ", currentChannel)
                const decryptedMessage = virgil.decryptMessage(currentChannel, body)
                console.log('decryptedMessage: ', decryptedMessage)
                // parse decryptedMessage for chapter, section, and block and pass in to sendResponse
                const chapter = JSON.parse(decryptedMessage).chapter
                const section = JSON.parse(decryptedMessage).section
                const block = JSON.parse(decryptedMessage).block
                dialogue.find(chapter, section, block).then(dialogueRow => {
                    console.log("dialogueRow: ",dialogueRow)
                    sendResponse(currentChannel, dialogueRow.payloadData);
                }).catch(err => console.log("dialogue.find catch: ",err))
                
            }).catch(err=>console.log("getChannelAsDasby catch",err))
    }
}

module.exports = {
    handleNewMessage: handleNewMessage
}