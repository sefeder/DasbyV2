import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';

export default class UserHomeScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        userInfo: this.props.navigation.state.params.userInfo.user,
        newUser: this.props.navigation.state.params.newUser,
        channel: null,
        userPrivateKey: null,
        messages: [],
        memberArray: []
    }


    componentDidMount() {
        virgil.getPrivateKey(this.state.userInfo.upi)
            .then(userPrivateKey => {
                this.setState({
                    userPrivateKey: userPrivateKey
                })
            })
            .catch(err => console.log(err))

        const virgilCrypto = new VirgilCrypto()
        twilio.getTwilioToken(this.state.userInfo.upi)
            .then(twilio.createChatClient)
            .then(chatClient => {
                if (this.state.newUser) {
                    api.getAdmin()
                    .then(result => {
                        const adminUpiArray = result.admin.map(admin=>admin.upi)
                        return twilio.createChannel(chatClient, this.state.userInfo.upi, adminUpiArray)
                            .then(twilio.joinChannel)
                            .then(channel => {
                                this.setState({ channel })
                                adminUpiArray.forEach(adminUpi=>channel.add(adminUpi))
                                this.configureChannelEvents(channel)
                            })
                    })
                
                }
                else {
                    return twilio.findChannel(chatClient, this.state.userInfo.upi)
                    .then(channel => {
                        this.setState({channel})
                        this.configureChannelEvents(channel)
                        channel.getMessages().then(result=>{
                            this.setState({
                                messages: result.items.map((message, i, items) => {
                                    return {
                                        author: message.author,
                                        body: this.decryptMessage(message.body),
                                        me: message.author === this.state.userInfo.upi,
                                        sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i-1].author === message.author
                                    }
                                })
                            })
                        })
                        channel.getMembers().then(result=>{
                            result.forEach(member=>{
                                api.getUser(member.identity).then(dbUser=>{
                                    this.setState({
                                        memberArray: [...this.state.memberArray, {
                                            upi: dbUser.user.upi,
                                            firstName: dbUser.user.first_name,
                                            lastName: dbUser.user.last_name
                                        }]
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
        const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes,this.state.userPrivateKey)
        const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
        const decryptedMessage = virgilCrypto.decrypt(encrytpedMessage, channelPrivateKey).toString('utf8')
        return decryptedMessage
    }

    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.state.userInfo.first_name }
        this.setState({
            messages: [...this.state.messages, messageData],
        })
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body }) => {
            this.addMessage({ author, body: this.decryptMessage(body) })
        })

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
        }
    }

render () {
    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                <Text>
                    Welcome Home {this.state.userInfo.first_name} {this.state.userInfo.last_name}
                </Text>
                <MessageList upi={this.state.userInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray}/>
                <MessageForm onMessageSend={this.handleNewMessage} />
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