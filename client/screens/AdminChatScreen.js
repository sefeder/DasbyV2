import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';

export default class AdminChatScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        adminInfo: this.props.navigation.state.params.adminInfo,
        channelDescriptor: this.props.navigation.state.params.channelDescriptor,
        channel: null,
        messages: []
    }


    componentDidMount() {
        console.log('this.state.adminInfo', this.state.adminInfo)
        console.log('this.state.channelDescriptor', this.state.channelDescriptor)
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
                Welcome Home {this.state.adminInfo.first_name} {this.state.adminInfo.last_name}
            </Text>
            <MessageList username={this.state.adminInfo.first_name} messages={this.state.messages} />
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