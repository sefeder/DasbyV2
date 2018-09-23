import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';

export default class AdminChatScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
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
                    messages: result.items.map(message => {
                        return {
                            author: message.author,
                            body: message.body,
                            me: message.author === this.state.adminInfo.upi
                        }
                    })
                })
            })
            channel.getMembers().then(result => {
                console.log("result: ", result)
                result.forEach(member => {
                    console.log("member: ", member)
                    api.getUser(member.identity).then(dbUser => {
                        console.log("dbUser: ", dbUser.user)
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

    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.state.adminInfo.first_name }
        this.setState({
            messages: [...this.state.messages, messageData],
        })
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body }) => {
            this.addMessage({ author, body })
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
            console.log("encrypted message: ", encryptedMessage)
            console.log("stringified encrypted message: ", encryptedMessage.toString('base64'))
            this.state.channel.sendMessage(encryptedMessage.toString('base64'))
        }
    }

render () {
    return (
        <KeyboardAvoidingView style={styles.app}>
            <Text>
                Welcome Home {this.state.adminInfo.first_name} {this.state.adminInfo.last_name}
            </Text>
            <MessageList upi={this.state.adminInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray} channel={this.state.channel} userPrivateKey={this.state.adminPrivateKey}/>
            <MessageForm onMessageSend={this.handleNewMessage} />
           
        </KeyboardAvoidingView>
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
        alignItems: 'center'
    }
})