import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

export default class InfoScreen extends Component {

    state = {
        modalVisible: false,
    }

    componentDidMount() {
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                {/* <View style={{ marginTop: 22 }}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        presentationStyle={'pageSheet'}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}
                        style={{ height: Dimensions.get('window').height * .5}}>
                        <View style={{ marginTop: 22 }}>
                            <View>
                                <Text>Hello World!</Text>

                                <TouchableHighlight
                                    onPress={() => {
                                        this.setState({modalVisible: !this.state.modalVisible});
                                    }}>
                                    <Text>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View> */}
                <ScrollView>
                    <View style={styles.textView}>
                        <Text style={styles.text}>
                            <Ionicons size={30} color='black' name='md-person' />  David Beiser, MD
                        </Text>
                        <Text style={styles.text}>
                            <Ionicons size={30} color='black' name='md-mail' />  dbeiser@uchicago.edu
                        </Text>
                        <Text selectable style={styles.text}>
                            <Icon size={30} color='black' name='phone' /> 773-217-8020
                        </Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginLeft: 5 }}>A message from Dr. Beiser:
                    </Text>
                    <View style={{flex: 1}}>
                        <WebView
                            source={{ uri: 'https://youtu.be/xhH63kkutzs' }}
                            style={styles.webView}
                        />
                    </View>
                </ScrollView>
                <View style={styles.menu}>
                    <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => { this.props.navigation.navigate('UserHomeScreen') }}>
                        <Ionicons size={40} color='#808080' name='md-chatboxes' />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => { this.props.navigation.navigate('ResultsScreen') }}>
                        <Ionicons size={40} color='#808080' name='md-pulse' />
                    </TouchableHighlight>
                    <Ionicons size={40} color='#3377FF' name='md-information-circle' />
                    <TouchableHighlight
                        underlayColor={'rgba(255, 255, 255, 0)'}
                        onPress={() => {
                            this.setState({ modalVisible: !this.state.modalVisible }, ()=>{
                                Alert.alert(
                                    'EMERGENCY',
                                    'In case of emergency: ',
                                    [
                                        { text: 'Call MOMS HELPLINE', onPress: () => console.log('Ask me later pressed') },
                                        { text: 'Cancel', onPress: () => this.setState({ modalVisible: !this.state.modalVisible }), style: 'cancel' },
                                        { text: 'Text a suicide counselor', onPress: () => console.log('OK Pressed') },
                                    ],
                                    { cancelable: false }
                                );
                            })
                        }}>
                        <Icon size={40} color={this.state.modalVisible ? '#3377FF':'#808080'} name='phone' />
                    </TouchableHighlight>
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
    },
     textView: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15  
    },
});