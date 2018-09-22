import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import { VirgilCrypto } from 'virgil-crypto'
import { ChannelDescriptor } from 'twilio-chat/lib/channeldescriptor';
import api from '../utils/api';

export default class AdminSelectionScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        adminInfo: this.props.navigation.state.params.adminInfo.user,
        channels: [],
        userArray: []
    }

    componentDidMount() {
        const virgilCrypto = new VirgilCrypto()
        //unsure how to get this.state.adminInfo.private_key back into useful format, line below does not work
        const privateKeyBytes = JSON.parse(this.state.adminInfo.private_key)
        // console.log (virgilCrypto.importPrivateKey(privateKeyBytes, this.state.adminInfo.password))
        console.log('UHS 18: ', privateKeyBytes)
        console.log('adminInfo in state on UserHomeScreen: ', this.state.adminInfo)
        twilio.getTwilioToken(this.state.adminInfo.upi)
            .then(twilio.createChatClient)
            .then(chatClient => {
                return twilio.getAllChannels(chatClient)
            })
            .then(result => {
                console.log(result)
                console.log(result.items)
                this.setState({channels: result.items})
            })
        api.getAllUsers().then(result => {
            result.forEach(user => {
                this.setState({
                    userArray: [...this.state.userArray, {
                        upi: user.upi,
                        firstName: user.first_name,
                        lastName: user.last_name
                    }]
                })
            })
        })
        
    }

    channelButtonHandler = selectedChannel => {
       console.log('you pressed a button...congrats! Idiot')
        this.props.navigation.navigate('AdminChatScreen', { adminInfo: this.state.adminInfo, channelDescriptor: selectedChannel})
    }

    determineUserName = (userUpi) => {
        for (let i = 0; i < this.state.userArray.length; i++) {
            let user = this.state.userArray[i];
            if (user.upi === userUpi) {
                return <Text style={styles.buttonText}> {user.firstName} {user.lastName} </Text>
            }
        }
    }


    render() {
        return (
            <ScrollView >
                <View style={styles.app}>
                    <Text>
                        Welcome, {this.state.adminInfo.first_name} {this.state.adminInfo.last_name}, To The Channel Selector
                    </Text>
                    <Text>
                        Please select a conversation to join
                    </Text>
                    <View style={styles.chatList}>

                        {this.state.channels.map((ChannelDescriptor, index) => {
                            return (
                                <TouchableHighlight key={index} style={styles.button} onPress={() => this.channelButtonHandler(ChannelDescriptor)}>
                                    {this.determineUserName(ChannelDescriptor.uniqueName)}
                                </TouchableHighlight>
                            )
                        })}

                    </View>

                </View>


            </ScrollView>
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
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 40,
        width: 300,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30
    },
    chatList: {
        overflow: 'scroll'
    }
})