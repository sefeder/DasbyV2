import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';

export default class LandingScreen extends Component {

    state = {

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <TouchableHighlight style={styles.button}
                    onPress={() => this.props.navigation.navigate('SignUpScreen')}>
                    <Text style={styles.buttonText}> Sign Up </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button}
                    onPress={() => this.props.navigation.navigate('LogInScreen')}>
                    <Text style={styles.buttonText}> User Log In </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button}
                    onPress={() => this.props.navigation.navigate('AdminSignUpScreen')}>
                    <Text style={styles.buttonText}> Admin Sign Up </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button}
                    onPress={() => this.props.navigation.navigate('AdminLogInScreen')}>
                    <Text style={styles.buttonText}> Admin Log In </Text>
                </TouchableHighlight>
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
});