import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto'

export default class UserHomeScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        userInfo: this.props.navigation.state.params.userInfo.user
    }


    componentDidMount() {
        const virgilCrypto = new VirgilCrypto()
        //unsure how to get this.state.userInfo.private_key back into useful format, line below does not work
        const privateKeyBytes = JSON.parse(this.state.userInfo.private_key)
        // console.log (virgilCrypto.importPrivateKey(privateKeyBytes, this.state.userInfo.password))
        console.log('UHS 18: ', privateKeyBytes)
        console.log('userInfo in state on UserHomeScreen: ',this.state.userInfo)
        twilio.getTwilioToken(this.state.userInfo.upi)
        .then(tokenPromise => {
            console.log("Token Promise: ",tokenPromise)
            return twilio.createChatClient(tokenPromise)
        })
        // .then(twilio.consoleLogging)
        .then(chatClient => {
            console.log("UserHomeScreen creating/joining Channel")
            const channel = twilio.joinChannel(chatClient, this.state.userInfo.upi);
            console.log("result of joinChannel: ", channel)
            channel.then(result => console.log("channel promise result: ", result))
            return channel
        })
        // .then(channel => {
        //     console.log("UserHomeScreen After Join Chat")
        //     console.log("UserHomeScreen channel: ", channel)
        // })
        // .then(channel => {
        //     console.log("UserHomeScreen Adding Admin to Channel")
        //     console.log("Channel returned: ", channel)
        //     return twilio.addAdminToChannel(this.state.userInfo.upi)
        // })
        // .then(result => {
        //     console.log(result)
        // }).catch(err => console.log(err))
        .catch(err => console.log(err))
    }


render () {
    return (
        <KeyboardAvoidingView style={styles.app}>
            <Text>
                Welcome Home
            </Text>
            <Text>
                Your name is: {this.state.userInfo.first_name} {this.state.userInfo.last_name} 
            </Text>
            <Text>
                Your UPI is: {this.state.userInfo.upi} 
            </Text>
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
        justifyContent: 'center'
    }
})