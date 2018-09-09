import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';
import { VirgilCrypto } from 'virgil-crypto'

export default class AdminHomeScreen extends Component {

    state = {
        //when you get to this page straight from a sign up (not a log in) object below has a private_key that is null
        adminInfo: this.props.navigation.state.params.adminInfo.user
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
            .then(result => console.log(result))
    }



    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <Text>
                    Welcome Home
            </Text>
                <Text>
                    Your name is: {this.state.adminInfo.first_name} {this.state.adminInfo.last_name}
                </Text>
                <Text>
                    Your UPI is: {this.state.adminInfo.upi}
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