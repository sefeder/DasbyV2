import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import twilio from '../utils/twilioUtil';

export default class UserHomeScreen extends Component {

    state = {
        userInfo: this.props.navigation.state.params.userInfo.user
    }

    componentDidMount() {
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