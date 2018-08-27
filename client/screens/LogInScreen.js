import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button } from 'react-native';
export default class LogInScreen extends Component {

    state = {

    }

    render() {
        return (
            <KeyboardAvoidingView style = { styles.app }>
                <Text>
                    Log In
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
        justifyContent: 'flex-end'
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
    }
});