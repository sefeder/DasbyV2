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
        console.log (virgilCrypto.importPrivateKey(privateKeyBytes, this.state.userInfo.password))
        console.log('userInfo in state on UserHomeScreen: ',this.state.userInfo)
        twilio.getTwilioToken(this.state.userInfo.upi)
        .then(twilio.createChatClient)
        .then(chatClient => console.log(chatClient))
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