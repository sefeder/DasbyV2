import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert, Platform, Linking } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-action-sheet';
import call from 'react-native-phone-call'

export default class EmergencyButton extends Component {

    state = {
    }

    componentDidMount() {
    }

    render() {
        const buttons = [
            'Call MOMS HELPLINE',
            'Text a suicide counselor',
            'Cancel'
        ];
        // const DESTRUCTIVE_INDEX = 3;
        const cancelIndex = 2;
        return (
            <TouchableHighlight
                underlayColor={'rgba(255, 255, 255, 0)'}
                onPress={ () => {
                    ActionSheet.showActionSheetWithOptions({
                        options: buttons,
                        cancelButtonIndex: cancelIndex,
                        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        tintColor: '#3377FF',
                        title: 'EMERGENCY',
                    },
                        (buttonIndex) => {
                            console.log('button clicked :', buttonIndex);
                            if (buttonIndex === 0) {
                                call({
                                    number: '18663646667',
                                    prompt: true
                                }).catch(console.error)
                            }
                            if (buttonIndex === 1) {
                                Linking.openURL('https://www.crisistextline.org/').catch(err => console.error('An error occurred', err));
                            }
                        });
                    // Alert.alert(
                    //     'EMERGENCY',
                    //     'In case of emergency: ',
                    //     [
                    //         { text: 'Call MOMS HELPLINE', onPress: () => {
                    //             console.log('Call MOMS HELPLINE pressed')
                    //         } },
                    //         { text: 'Text a suicide counselor', onPress: () => {
                    //             console.log('Text a suicide counselor Pressed')
                    //         } },
                    //         { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                    //     ],
                    //     { cancelable: false }
                    // )
                }}>
                <View>
                    <Icon style={{
                        height: 30, width: 28.5, marginLeft: 19.5
                    }} size={31} color={'red'} name='ios-warning' />
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