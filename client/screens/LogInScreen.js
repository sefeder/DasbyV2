import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import api from '../utils/api';

export default class LogInScreen extends Component {

    state = {
        emailInput: null,
        passwordInput: null,
        hiddenPass: true,
    }
    viewPass = () => {
        this.setState({hiddenPass: !this.state.hiddenPass})
    }
    submitLogIn = () => {
        api.logIn({
            email: this.state.emailInput,
            password: this.state.passwordInput
        })
            .then(res => {
                if (!res.status && res.message === "invalid email") {
                    console.log('that email is invalid')
                    this.setState({emailInput: '', passwordInput: ''})
                    return;
                }
                if (!res.status && res.message === "password does not match") {
                    console.log('that password does not match that email')
                    this.setState({ emailInput: '', passwordInput: '' })
                    return;
                }
                AsyncStorage.setItem('userInfo', JSON.stringify(res), () => {
                    this.props.navigation.navigate('UserHomeScreen', {userInfo: res, newUser: false})
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}> 
                    <View style={styles.inputForm}>
                        <View>
                            <Text style={styles.inputLabel}>
                                Email:
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoFocus
                                onChangeText={(emailInput) => this.setState({ emailInput })}
                                value={this.state.emailInput}
                                placeholder='Email'
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
                                placeholder='Password'
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
                        <TouchableHighlight style={styles.button} onPress={this.submitLogIn}>
                            <Text style={styles.buttonText}> Log In </Text>
                        </TouchableHighlight>
                    </View>
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