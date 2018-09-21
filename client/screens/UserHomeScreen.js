import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';

export default class UserHomeScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        userInfo: this.props.navigation.state.params.userInfo.user,
        newUser: this.props.navigation.state.params.newUser,
        channel: null,
        messages: [],
        memberArray: []
    }


    componentDidMount() {
        const virgilCrypto = new VirgilCrypto()
        twilio.getTwilioToken(this.state.userInfo.upi)
        .then(twilio.createChatClient)
        .then(chatClient => {
            if (this.state.newUser) {
                console.log('if statement newUser')
                //admin upi is hardcoded below, need to get it programatically
                api.getAdmin()
                .then(result => {
                    console.log('admin.admin.upi', result.admin.upi)
                    return twilio.createChannel(chatClient, this.state.userInfo.upi, result.admin.upi)
                        .then(twilio.joinChannel)
                        .then(channel => {
                            this.setState({ channel })
                            console.log(channel)
                            channel.add(result.admin.upi)
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
                        console.log('result: ',result)
                        console.log('result.items', result.items)
                        this.setState({
                            messages: result.items.map(message => {
                                return {
                                    author: message.author,
                                    body: message.body,
                                    me: message.author === this.state.userInfo.upi
                                }
                            })
                        })
                    })
                    channel.getMembers().then(result=>{
                        this.setState({memberArray: 
                            result.map(member => {
                                return api.getUser(member.identity).then(dbUser => {
                                    return {
                                        upi: dbUser.user.upi,
                                        first_name: dbUser.user.first_name,
                                        last_name: dbUser.user.last_name,

                                    }
                                })
                            })
                        }, console.log(this.state.memberArray)) 
                    })
                })
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
            <MessageList upi={this.state.userInfo.upi} messages={this.state.messages} />
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