const twilio = require('./dasbyTwilio')
const virgil = require('./dasbyVirgil')
const dialogue = require('../models/dialogue')
const Users = require('../models/Users')


const sendResponse = (channel, message) => {
    console.log('send response hit!!!')
    channel.sendMessage(virgil.encryptMessage(channel, message))
}

canParseStr = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

handleNewMessage = (channelSid, body, author) => {
    Users.findOne({ first_name: 'Dasby' })
    .then(dasby => {
        if (author !== dasby.upi ) {
            twilio.getChannelAsDasby(dasby.upi, channelSid)
            .then(currentChannel =>{
                console.log("handleNewMessage currentChannel: ", currentChannel)
                const decryptedMessageString = virgil.decryptMessage(currentChannel, body, dasby.private_key, dasby.upi)
                console.log('decryptedMessageString: ', decryptedMessageString)
                // parse decryptedMessage for chapter, section, and block and pass in to sendResponse
                if (canParseStr(decryptedMessageString)) {
                    const decryptedMessage = JSON.parse(decryptedMessageString)
                    dialogue.find(decryptedMessage.chapter, decryptedMessage.section, decryptedMessage.block).then(dialogueRow => {
                        currentChannel.typing()
                        setTimeout(() => {
                            sendResponse(currentChannel, dialogueRow.payloadData);
                        }, 1000);
                    }).catch(err => console.log("dialogue.find catch: ",err))
                } else {
                    // sendResponse(currentChannel, 'Sorry, I\'m not taking free response answers at this time');
                }
                
            }).catch(err=>console.log("getChannelAsDasby catch",err))
        }
    })
}

module.exports = {
    handleNewMessage: handleNewMessage
}