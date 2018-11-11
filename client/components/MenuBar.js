import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class MenuBar extends Component {

    state = {
    }


    render() {
        return (
            <View style={styles.menu}>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('UserHomeScreen')
                }}>
                    <View>
                        <Ionicons style={{
                            height: 30, width: 27, marginLeft: 2.5
                        }} size={33} color={this.props.screen === 'chat' ? '#3377FF':'#808080'} name='md-chatboxes' />
                        <Text style={{ color: this.props.screen === 'chat'? '#3377FF' : '#808080', fontSize: 10.5 }}> Chat </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('ResultsScreen')
                }}>
                    <View>
                        <Ionicons style={{
                            height: 30, width: 27, marginLeft: 2.25
                        }} size={33} color={this.props.screen === 'data' ? '#3377FF' : '#808080'} name='md-pulse' />
                        <Text style={{ color: this.props.screen === 'data' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Data </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('InfoScreen')
                }}>
                    <View>
                        <Ionicons style={{
                            height: 30, width: 27, marginRight: 1
                        }} size={33} color={this.props.screen === 'info' ? '#3377FF' : '#808080'} name='md-information-circle' />
                        <Text style={{ color: this.props.screen === 'info' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Info </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'}>
                    <View>
                        <Ionicons style={{
                            height: 30, width: 27, marginLeft: 5
                        }} size={33} color='#808080' name='md-call' />
                        <Text style={{ color: '#808080', fontSize: 10.5 }}> Phone </Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    menu: {
        display: 'flex',
        borderTopColor: 'black',
        borderTopWidth: .2,
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height * .062,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
        elevation: 1
    },
});

export default MenuBar