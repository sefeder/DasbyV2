import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert, Platform } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons, Entypo } from '@expo/vector-icons';
import ActionSheet from 'react-native-action-sheet';

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
                    <Entypo style={{
                        height: 30, width: 28.5, marginLeft: 17.5
                    }} size={28.5} color={'red'} name='warning' />
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