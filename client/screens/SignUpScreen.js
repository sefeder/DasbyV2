import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import { Chance } from 'chance';
import virgil from '../utils/virgilUtil';
import api from '../utils/api';

export default class SignUpScreen extends Component {

    state = {
        emailInput: null,
        passwordInput: null,
        firstInput: null,
        lastInput: null,
        hiddenPass: true,

        // NOT SURE IF WE WANNA DO IT THIS WAY
        userInfo: null
    }
    viewPass = () => {
        this.setState({ hiddenPass: !this.state.hiddenPass })
    }

    submitSignUp = () => {

        //need signup validation here

        let chance = new Chance()
        api.createUser({
            email: this.state.emailInput,
            password: this.state.passwordInput,
            first_name: this.state.firstInput,
            last_name: this.state.lastInput,
            hospital: 'UChicago',
            upi: chance.string({
                length: 10,
                pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
            }),
            role: 'user'
        })
            .then(res => {
                virgil.initializeVirgil(res.user.upi)
                    .then(updatedUser => {
                        console.log("-- Virgil User Created, Public Card Returned!! --")
                        this.props.navigation.navigate('UserHomeScreen', { userInfo: updatedUser, newUser: true})
                    })
                    .catch(err => console.log('error line 51 SUS: ', err))
            })
            .catch(err => console.log('error line 53 SUS: ', err))
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}> 
                    <ScrollView>
                        <View style={styles.inputForm}>
                            <View>
                                <Text style={styles.inputLabel}>
                                    First Name:
                                </Text>
                                <TextInput
                                    autoFocus
                                    style={styles.textInput}
                                    onChangeText={(firstInput) => this.setState({ firstInput })}
                                    value={this.state.firstInput}
                                    placeholder='e.g. Joe'
                                />
                            </View>
                            <View>
                                <Text style={styles.inputLabel}>
                                    Last Name:
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={(lastInput) => this.setState({ lastInput })}
                                    value={this.state.lastInput}
                                    placeholder='e.g. Smith'
                                />
                            </View>
                            <View>
                                <Text style={styles.inputLabel}>
                                    Email:
                                </Text>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={(emailInput) => this.setState({ emailInput })}
                                    value={this.state.emailInput}
                                    placeholder='e.g. joesmith@gmail.com'
                                    autoCapitalize='none'
                                    textContentType='emailAddress'
                                />
                            </View>
                            <View style={styles.marginBottom}>
                                <Text style={styles.inputLabel}>
                                    Password:
                                </Text>
                                <TextInput
                                    style={styles.passwordTextInput}
                                    onChangeText={(passwordInput) => this.setState({ passwordInput })}
                                    value={this.state.passwordInput}
                                    placeholder='At least 6 characters'
                                    autoCapitalize='none'
                                    textContentType='password'
                                    secureTextEntry={this.state.hiddenPass}
                                />
                                <Button
                                    title={this.state.hiddenPass ? 'View Password' : 'Hide Password'}
                                    onPress={this.viewPass}
                                >
                                </Button>
                            </View>
                            <TouchableHighlight style={styles.button} onPress={this.submitSignUp}>
                                <Text style={styles.buttonText}> Sign Up </Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
        width: 300,
        paddingLeft: 15,
        paddingRight: 15
    },
    passwordTextInput: {
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 3,
        height: 50,
        width: 300,
        paddingLeft: 15,
        paddingRight: 15
    },
    marginBottom: {
        marginBottom: 40
    },
    inputForm: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputLabel: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});