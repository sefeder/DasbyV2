import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import { VirgilCrypto } from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';
import QuickReply from '../components/QuickReply';

export default class UserHomeScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        userInfo: this.props.navigation.state.params.userInfo.user,
        newUser: this.props.navigation.state.params.newUser,
        channel: null,
        userPrivateKey: null,
        messages: [],
        memberArray: [],
        DasbyUpi: null,
        responseArray: [],
        isTyping: false,
        memberTyping: null,
        isQrVisible: true
    }


    componentDidMount() {
        const startTime = Date.now();
        console.log("----------------------------------------------------------")
        console.log("hitting compoenentDidMount at: ", (Date.now()-startTime)/1000)
        virgil.getPrivateKey(this.state.userInfo.upi)
            .then(userPrivateKey => {
                console.log("Virgil Private Key Retrieved: ", (Date.now() - startTime) / 1000)
                this.setState({
                    userPrivateKey: userPrivateKey
                })
            })
            .catch(err => console.log(err))
        api.getDasbyUpi()
            .then(dasbyInfo => {
                console.log("Dasby UPI Retrieved: ", (Date.now() - startTime) / 1000)                
                this.setState({
                    DasbyUpi: dasbyInfo.dasby.upi
                })
            })
            .catch(err => console.log(err))

        const virgilCrypto = new VirgilCrypto()
        twilio.getTwilioToken(this.state.userInfo.upi)
            .then(twilio.createChatClient)
            .then(chatClient => {
                console.log("Twilio Chat Client Recieved: ", (Date.now() - startTime) / 1000)
                if (this.state.newUser) {
                    api.getAdmin()
                        .then(result => {
                            const adminUpiArray = result.admin.map(admin => admin.upi)
                            return twilio.createChannel(chatClient, this.state.userInfo.upi, adminUpiArray)
                                .then(twilio.joinChannel)
                                .then(channel => {
                                    console.log("New Twilio Channel Created and Joined Retrieved: ", (Date.now() - startTime) / 1000)
                                    this.setState({ channel })
                                    adminUpiArray.forEach(adminUpi => channel.add(adminUpi))
                                    this.configureChannelEvents(channel)
                                })
                        })

                }
                else {
                    return twilio.findChannel(chatClient, this.state.userInfo.upi)
                        .then(channel => {
                            console.log("Twilio Channel Found: ", (Date.now() - startTime) / 1000)
                            this.setState({ channel })
                            this.configureChannelEvents(channel)
                            channel.getMessages().then(result => {
                                console.log("Twilio Messages Retrieved: ", (Date.now() - startTime) / 1000)
                                console.log("----------------------------------------------------------------------------------------")
                                this.setState({
                                    messages: result.items.map((message, i, items) => {
                                        console.log("Messages Map Function - message #",i, " at: " ,(Date.now() - startTime) / 1000)
                                        if (message.author === this.state.DasbyUpi) {
                                            return {
                                                author: message.author,
                                                body: this.parseDasbyPayloadData(this.decryptMessage(message.body)),
                                                me: message.author === this.state.userInfo.upi,
                                                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author
                                            }
                                        } else {
                                            return {
                                                author: message.author,
                                                body: this.parseUserPayloadData(this.decryptMessage(message.body)),
                                                me: message.author === this.state.userInfo.upi,
                                                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author
                                            }
                                        }
                                    })
                                    
                                }, ()=> {
                                    console.log("---------------------END SET STATE MESSAGES-----------------------", (Date.now() - startTime) / 1000)
                                })
                            })
                            channel.getMembers().then(result => {
                                console.log("Channel Members Gotten: ", (Date.now() - startTime) / 1000)
                                result.forEach((member,i) => {
                                    api.getUser(member.identity).then(dbUser => {
                                        this.setState({
                                            memberArray: [...this.state.memberArray, {
                                                upi: dbUser.user.upi,
                                                firstName: dbUser.user.first_name,
                                                lastName: dbUser.user.last_name
                                            }]
                                        }, ()=> {
                                            console.log("Set State Member ", i, " at:", (Date.now() - startTime) / 1000)
                                            })
                                    })
                                })
                            })
                        })
                }
            })

    }

    decryptMessage = (encrytpedMessage) => {
        const virgilCrypto = new VirgilCrypto();
        const channelPrivateKeyBytes = this.state.channel.attributes.privateKey;
        const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, this.state.userPrivateKey)
        const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
        const decryptedMessage = virgilCrypto.decrypt(encrytpedMessage, channelPrivateKey).toString('utf8')
        return decryptedMessage
    }

    navigate = (screenName, objectToPass) => {
        this.props.navigation.navigate(screenName, objectToPass)
    }

    canParseStr = str => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    parseDasbyPayloadData = payloadDataString => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            if (payloadData.payload) {
                this.setState({
                    responseArray: payloadData.payload,
                    isQrVisible: true
                })
            } else {
                this.setState({
                    responseArray: []
                })
            }
            if (payloadData.imageURL || payloadData.videoURL) {
                const message = payloadData
                return message
            } else {
                const message = payloadData.message
                return message
            }
            
        } else {
            const message = payloadDataString
            return message
        }
    }

    parseUserPayloadData = payloadDataString => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            if (payloadData.imageURL || payloadData.videoURL) {
                const message = payloadData
                return message
            } else {
                const message = payloadData.message
                return message
            }
        } else {
            const message = payloadDataString
            return message
        }

    }
    // may not need undefined clause in ternary below
    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.state.userInfo.upi, sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author }
        this.setState({
            messages: [...this.state.messages, messageData],
        })
    }

    updateTypingIndicator = (memberTyping, isTyping) => {
        if (isTyping) {
            console.log('member typing: ', memberTyping.identity)
            this.setState({ isTyping: true, memberTyping: memberTyping.identity })
        } else {
            console.log("ID " + memberTyping.identity + " has stopped typing")
            this.setState({ isTyping: false, memberTyping: memberTyping.identity })
        }
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body }) => {
            if (author === this.state.DasbyUpi) {
                this.addMessage({ author, body: this.parseDasbyPayloadData(this.decryptMessage(body)) })
            } else {
                this.addMessage({ author, body: this.parseUserPayloadData(this.decryptMessage(body)) })
            }
        })

        //set up the listener for the typing started Channel event
        channel.on('typingStarted', member => {
            //process the member to show typing
            this.updateTypingIndicator(member, true);
        });

        //set  the listener for the typing ended Channel event
        channel.on('typingEnded', member => {
            //process the member to stop showing typing
            this.updateTypingIndicator(member, false);
        });

        // channel.on('memberJoined', (member) => {
        //     this.addMessage({ body: `${member.identity} has joined the channel.` })
        // })

        // channel.on('memberLeft', (member) => {
        //     this.addMessage({ body: `${member.identity} has left the channel.` })
        // })
    }

    handleNewMessage = (text) => {
        if (this.state.channel) {
            const virgilCrypto = new VirgilCrypto();
            const importedPublicKey = virgilCrypto.importPublicKey(this.state.channel.attributes.publicKey)
            const encryptedMessage = virgilCrypto.encrypt(text, importedPublicKey)
            this.state.channel.sendMessage(encryptedMessage.toString('base64'))
            this.setState({isQrVisible: false})
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                    <Text>
                        Welcome Home {this.state.userInfo.first_name} {this.state.userInfo.last_name}
                    </Text>
                    <MessageList memberTyping={this.state.memberTyping} isTyping={this.state.isTyping} upi={this.state.userInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray} />
                    {this.state.responseArray.length === 0 ?
                        <MessageForm channel={this.state.channel} onMessageSend={this.handleNewMessage} /> :
                        <QuickReply ref={ref => this.QuickReply = ref} upi={this.state.userInfo.upi} navigate={this.navigate} onMessageSend={this.handleNewMessage} responseArray={this.state.responseArray} isQrVisible={this.state.isQrVisible}/>
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }


}
const styles = StyleSheet.create({
    app: {
        display: 'flex',
        overflow: 'scroll',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
})