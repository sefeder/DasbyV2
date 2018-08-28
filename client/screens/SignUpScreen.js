import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';

export default class SignUpScreen extends Component {

    state = {
        emailInput: null,
        passwordInput: null,
        firstInput: null,
        lastInput: null
    }

    submitSignUp = () => {
        return fetch(`http://localhost:3000/database/users/createNewUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.emailInput,
                password: this.state.passwordInput,
                first_name: this.state.firstInput,
                last_name: this.state.lastInput,
                hospital: 'UChicago',
                upi: 'aaabbbcccddd'
             })
        })
            .then(res => res.json())
            .catch(err => console.log(err))
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <View style={styles.inputForm}>
                    <TextInput
                        autoFocus
                        style={styles.textInput}
                        onChangeText={(firstInput) => this.setState({ firstInput })}
                        value={this.state.firstInput}
                        placeholder='First Name'
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(lastInput) => this.setState({ lastInput })}
                        value={this.state.lastInput}
                        placeholder='Last Name'
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(emailInput) => this.setState({ emailInput })}
                        value={this.state.emailInput}
                        placeholder='Email'
                        autoCapitalize='none'
                        textContentType='emailAddress'
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(passwordInput) => this.setState({ passwordInput })}
                        value={this.state.passwordInput}
                        placeholder='Password'
                        autoCapitalize='none'
                        textContentType='password'
                        secureTextEntry={true}
                    />
                    
                    <TouchableHighlight style={styles.button} onPress={this.submitSignUp}>
                        <Text style={styles.buttonText}> Sign Up </Text>
                    </TouchableHighlight>
                </View>
                
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
    textInput: {
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 40,
        height: 50,
        width: 300
    },
    inputForm: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});