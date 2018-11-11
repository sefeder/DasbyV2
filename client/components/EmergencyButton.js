import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons, Entypo } from '@expo/vector-icons';

export default class EmergencyButton extends Component {

    state = {
    }

    componentDidMount() {
    }

    render() {
        return (
            <TouchableHighlight
                underlayColor={'rgba(255, 255, 255, 0)'}
                onPress={ () => {
                    Alert.alert(
                        'EMERGENCY',
                        'In case of emergency: ',
                        [
                            { text: 'Call MOMS HELPLINE', onPress: () => {
                                console.log('Call MOMS HELPLINE pressed')
                            } },
                            { text: 'Text a suicide counselor', onPress: () => {
                                console.log('Text a suicide counselor Pressed')
                            } },
                            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                        ],
                        { cancelable: false }
                    )
                }}>
                <View>
                    <Entypo style={{
                        height: 30, width: 32, marginLeft: 15
                    }} size={33} color={'red'} name='warning' />
                    <Text style={{ color: 'red', fontSize: 10, marginRight: 8 }}> EMERGENCY </Text>
                </View>
            </TouchableHighlight>
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
    }
});