import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';

export default class UserHomeScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        userInfo: this.props.navigation.state.params.userInfo.user,
        newUser: this.props.navigation.state.params.newUser,
        channel: null,
        messages: []
    }


    componentDidMount() {
        const virgilCrypto = new VirgilCrypto()
        twilio.getTwilioToken(this.state.userInfo.upi)
        .then(twilio.createChatClient)
        .then(chatClient => {
            if (this.state.newUser) {
                console.log('if statement newUser')
                //admin upi is hardcoded below, need to get it programatically
                return twilio.createChannel(chatClient, this.state.userInfo.upi, "OE08fM64qx")
                    .then(twilio.joinChannel)
                    .then(channel => {
                        this.setState({channel})
                        console.log(channel)
                        channel.add("OE08fM64qx")
                        this.configureChannelEvents(channel)
                    })
            }
            else {
                return twilio.findChannel(chatClient, this.state.userInfo.upi)
                .then(channel=>this.setState({channel}))
            } 
        })
       
    }

    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.state.userInfo.first_name }
        this.setState({
            messages: [...this.state.messages, messageData],
        })
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body }) => {
            this.addMessage({ author, body })
        })

        channel.on('memberJoined', (member) => {
            this.addMessage({ body: `${member.identity} has joined the channel.` })
        })

        channel.on('memberLeft', (member) => {
            this.addMessage({ body: `${member.identity} has left the channel.` })
        })
    }

    handleNewMessage = (text) => {
        if (this.state.channel) {
            this.state.channel.sendMessage(text)
        }
    }

render () {
    return (
        <KeyboardAvoidingView style={styles.app}>
            <Text>
                Welcome Home {this.state.userInfo.first_name} {this.state.userInfo.last_name}
            </Text>
            <MessageList username={this.state.userInfo.first_name} messages={this.state.messages} />
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
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})