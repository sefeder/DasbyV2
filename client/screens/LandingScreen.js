import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, AsyncStorage } from 'react-native';

export default class LandingScreen extends Component {

    state = {

    }

    componentDidMount() {
        AsyncStorage.getItem('userInfo', (err, result)=>{
            if (err) console.log(err)
            if (result !== null){
                console.log('JSON.parse(result): ', JSON.parse(result))
                if (JSON.parse(result).user.role === 'user'){
                    this.props.navigation.navigate('UserHomeScreen', {userInfo: JSON.parse(result), newUser: false})
                } else {
                    this.props.navigation.navigate('AdminSelectionScreen', { adminInfo: JSON.parse(result) })
                }
            }
        })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <TouchableHighlight style={styles.button}
                    onPress={() => this.props.navigation.navigate('LogInScreen')}>
                    <Text style={styles.buttonText}> Log In </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button}
                    onPress={() => this.props.navigation.navigate('SignUpScreen')}>
                    <Text style={styles.buttonText}> Sign Up </Text>
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