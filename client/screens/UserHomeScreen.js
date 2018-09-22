import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
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
        messages: [],
        memberArray: []
    }


    componentDidMount() {
        console.log("hello?")
        virgil.getPrivateKey(this.state.userInfo.upi)
            .then(result => console.log("private key", result))
            .catch(err => console.log(err))

        const virgilCrypto = new VirgilCrypto()
        twilio.getTwilioToken(this.state.userInfo.upi)
            .then(twilio.createChatClient)
            .then(chatClient => {
                if (this.state.newUser) {
                    console.log('if statement newUser')
                    //admin upi is hardcoded below, need to get it programatically
                    api.getAdmin()
                    .then(result => {
                        console.log('result.admin', result.admin)
                        const adminUpiArray = result.admin.map(admin=>admin.upi)
                        console.log('adminUpiArray: ', adminUpiArray)
                        return twilio.createChannel(chatClient, this.state.userInfo.upi, adminUpiArray)
                            .then(twilio.joinChannel)
                            .then(channel => {
                                this.setState({ channel })
                                console.log(channel)
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
                            console.log("result: ", result)
                            result.forEach(member=>{
                                console.log("member: ", member)
                                api.getUser(member.identity).then(dbUser=>{
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

            
            <MessageList upi={this.state.userInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray}/>
            <MessageForm style={styles.messageForm} onMessageSend={this.handleNewMessage} />
           
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
        alignItems: 'center',
        height: 200
    }
})