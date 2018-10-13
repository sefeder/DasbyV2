import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';

export default class AdminChatScreen extends Component {

    state = {
        adminInfo: this.props.navigation.state.params.adminInfo,
        channelDescriptor: this.props.navigation.state.params.channelDescriptor,
        channel: null,
        adminPrivateKey: null,
        messages: [],
        memberArray: []
    }

    componentDidMount() {
        virgil.getPrivateKey(this.state.adminInfo.upi)
            .then(adminPrivateKey => {
                this.setState({
                    adminPrivateKey: adminPrivateKey
                })
            })
            .catch(err => console.log(err))

        this.state.channelDescriptor.getChannel()
        .then(channel => {
            this.setState({channel})
            this.configureChannelEvents(channel)
            channel.getMessages().then(result => {
                this.setState({
                    messages: result.items.map((message, i, items) => {
                        return {
                            author: message.author,
                            body: this.decryptMessage(message.body),
                            me: message.author === this.state.adminInfo.upi,
                            sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author
                        }
                    })
                })
            })
            channel.getMembers().then(result => {
                result.forEach(member => {
                    api.getUser(member.identity).then(dbUser => {
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

    decryptMessage = (encrytpedMessage) => {
        const virgilCrypto = new VirgilCrypto();
        const channelPrivateKeyBytes = this.state.channel.attributes.privateKey;
        const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, this.state.adminPrivateKey)
        const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
        const decryptedMessage = virgilCrypto.decrypt(encrytpedMessage, channelPrivateKey).toString('utf8')
        return decryptedMessage
    }

    canParseStr = str => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    parseIncomingPayloadData = payloadDataString => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            const message = payloadData.message
            return message
        } else {
            const message = payloadDataString
            return message
        }
    }

// may not need undefined clause in ternary below
    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.state.adminInfo.first_name, sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author }
        this.setState({
            messages: [...this.state.messages, messageData],
        })
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body }) => {
            this.addMessage({ author, body: this.parseIncomingPayloadData(this.decryptMessage(body)) })
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
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                <Text>
                    Welcome Home {this.state.adminInfo.first_name} {this.state.adminInfo.last_name}
                </Text>
                <MessageList upi={this.state.adminInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray} />
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
    }
})