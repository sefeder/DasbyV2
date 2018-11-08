import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

export default class InfoScreen extends Component {

    state = {

    }

    componentDidMount() {
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <ScrollView>
                    <Text style={styles.text}>
                        Investigator: David Beiser, MD
                    </Text>
                    <Text style={styles.text}>
                        email: dbeiser@uchicago.edu
                    </Text>
                    <Text style={styles.text}>
                        mobile: 773-217-8020
                    </Text>
                    <Text style={styles.text}>
                        A message from Dr. Beiser:
                    </Text>
                    <View style={{flex: 1}}>
                        <WebView
                            source={{ uri: 'https://youtu.be/xhH63kkutzs' }}
                            style={styles.webView}
                        />
                    </View>
                </ScrollView>
                <View style={styles.menu}>
                    <TouchableHighlight onPress={() => { this.props.navigation.navigate('UserHomeScreen') }}>
                        <Ionicons size={40} color='#808080' name='md-chatboxes' />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this.props.navigation.navigate('ResultsScreen') }}>
                        <Ionicons size={40} color='#808080' name='md-pulse' />
                    </TouchableHighlight>
                    <Ionicons size={40} color='#3377FF' name='md-information-circle' />
                    <Icon size={40} color='#808080' name='phone' />
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
        justifyContent: 'flex-end'
    },
    menu: {
        display: 'flex',
        borderTopColor: 'black',
        borderTopWidth: .2,
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height * .055,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10
    },
    text: {
        fontSize: 18,
        marginBottom: 10
    },
    webView: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.42
    }
});