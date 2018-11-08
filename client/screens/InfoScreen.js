import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image } from 'react-native';

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
                <Text>
                    Investigator:  David Beiser, MD
                </Text>
                <Text>
                    email: dbeiser@uchicago.edu
                </Text>
                <Text>
                    mobile: 773-217-8020
                </Text>
                <Text>
                    Message from Dr. Beiser
                </Text>
                <Image source={{ uri: 'https://www.uchicagomedicine.org/-/media/images/ucmc/physician-photos/a-c/beiser-david-bio-261x347.jpg?h=347&as=1&hash=B7419F49097900DEC5D4A2E4E9DEB008ECEA4D63' }}
                    style={{ width: 400, height: 500 }} />
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
});