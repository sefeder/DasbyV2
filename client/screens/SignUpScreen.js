import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, TouchableOpacity, AsyncStorage } from 'react-native';
import { Chance } from 'chance';
import virgil from '../utils/virgilUtil';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from 'react-native-woodpicker';

export default class SignUpScreen extends Component {

    state = {
        emailInput: null,
        passwordInput: null,
        firstInput: null,
        lastInput: null,
        hiddenPass: true,
        adminCodeInput: null,
        roleInput: null,

        // NOT SURE IF WE WANNA DO IT THIS WAY
        userInfo: null
    }


    viewPass = () => {
        this.setState({ hiddenPass: !this.state.hiddenPass })
    }
    handleChange = value => {
        this.setState({ roleInput: value })
    }

    submitSignUp = () => {

        //need signup validation here
        if (this.state.roleInput === null) {
            console.log('Please enter a role')
            return;
        }
        if (this.state.roleInput === 'admin' && this.state.adminCodeInput !== 'Admin') {
            console.log('invalid admin code')
            this.setState({
                emailInput: null,
                passwordInput: null,
                firstInput: null,
                lastInput: null,
                adminCodeInput: null
            })
            return
        }

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
            role: this.state.roleInput
        })
            .then(res => {
                virgil.initializeVirgil(res.user.upi)
                    .then(updatedUser => {
                        console.log("-- Virgil User Created, Public Card Returned!! --")
                        if (this.state.roleInput === 'user') {
                            AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser), () => {
                                this.props.navigation.navigate('UserHomeScreen', { userInfo: updatedUser, newUser: true})
                            })
                        }
                        else if (this.state.roleInput === 'admin') {
                            AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser), () => {
                                this.props.navigation.navigate('AdminSelectionScreen', { adminInfo: updatedUser })
                            })
                        }
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
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginTop: 20
                                }}
                                >
                                    Role:
                                </Text>
                                <Picker
                                    onItemChange={this.handleChange}
                                    value={this.state.roleInput}
                                    style = { styles.textInput }
                                    items={[
                                        { label: "Please select a role", value: null },
                                        { label: "User", value: "user" },
                                        { label: "Admin", value: "admin" }
                                    ]}
                                    item={{label: "Please select a role", value: null}}
                                    placeholder={'Please select a role'}
                                    androidPickerMode="dropdown"
                                />
                            </View>
                            {this.state.roleInput === 'admin' && 
                            <View>
                                <Text style={styles.inputLabel}>
                                    Admin Code:
                            </Text>
                                <TextInput
                                    autoFocus
                                    style={styles.textInput}
                                    onChangeText={(adminCodeInput) => this.setState({ adminCodeInput })}
                                    value={this.state.adminCodeInput}
                                    placeholder='Enter the code you were given here'
                                />
                            </View>
                            }
                            <View>
                                <Text style={styles.inputLabel}>
                                    First Name:
                                </Text>
                                <TextInput
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
                                <View style={styles.passwordTextInput}>
                                    < View style={{ flex: 1 }}>
                                        <TextInput
                                            style={{ fontSize: this.state.hiddenPass ? 13.5 : 14}}
                                            onChangeText={(passwordInput) => this.setState({ passwordInput })}
                                            value={this.state.passwordInput}
                                            placeholder='Password'
                                            autoCapitalize='none'
                                            textContentType='password'
                                            secureTextEntry={this.state.hiddenPass}
                                        />
                                    </View >
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        {this.state.passwordInput !== null && this.state.passwordInput !== '' &&
                                            <TouchableOpacity
                                                onPress={this.viewPass}
                                            >
                                            <Ionicons style={{ alignSelf: 'flex-end' }} size={30} color='#810000' name={this.state.hiddenPass ? 'md-eye' : 'md-eye-off'} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View >
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
        backgroundColor: '#810000',
        borderRadius: 10,
        width: 300,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 30
    },
    textInput: {
        borderColor: '#810000',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 30,
        height: 50,
        width: 300,
        paddingLeft: 15,
        paddingRight: 15
    },
    passwordTextInput: {
        flexDirection: 'row',
        borderColor: '#810000',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 5,
        height: 50,
        width: 300,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
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