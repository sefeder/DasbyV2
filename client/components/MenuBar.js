import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EmergencyButton from './EmergencyButton'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

class MenuBar extends Component {

    state = {
        role: null
    }

    componentDidMount() {
        AsyncStorage.getItem('userInfo', (err, result)=>{
            if(result !== null){
                this.setState({role: JSON.parse(result).user.role})
            }
        })
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    render() {
        const buttons = [
            'Take a Survey',
            'Study Info',
            'Log Out',
            'Cancel'
        ];
        const destructiveIndex = 3;
        const cancelIndex = 3;
        return (
            <View>
            { this.state.role==='user' ?

            <View style={styles.menu}>

                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('UserHomeScreen')
                }}>
                    <View>
                        <Icon style={{
                            height: 30, width: 27, marginLeft: 2.5
                        }} size={33} color={this.props.screen === 'chat' ? '#3377FF':'#808080'} name='ios-chatboxes' />
                        <Text style={{ color: this.props.screen === 'chat'? '#3377FF' : '#808080', fontSize: 10.5 }}> Chat </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('ResultsScreen')
                }}>
                    <View>
                        <Icon style={{
                            height: 30, width: 28.5, marginLeft: 2.25
                        }} size={33} color={this.props.screen === 'data' ? '#3377FF' : '#808080'} name='md-pulse' />
                        <Text style={{ color: this.props.screen === 'data' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Data </Text>
                    </View>
                </TouchableHighlight>
                <EmergencyButton/>
                <View>
                    <TouchableHighlight
                    underlayColor={'rgba(255, 255, 255, 0)'}
                    onPress={() => {
                        this.showActionSheet()
                    }}
                    >
                        <View>
                            <Icon style={{
                                height: 30, width: 28.5, marginBottom: 10
                            }} size={37} color={'#808080'} name='ios-more' />
                        </View>
                    </TouchableHighlight>
                    <ActionSheet
                        handleNewSurvey={this.props.handleNewSurvey}
                        ref={o => this.ActionSheet = o}
                        title={<Text>OPTIONS</Text>}
                        options={buttons}
                        cancelButtonIndex={cancelIndex}
                        destructiveButtonIndex={destructiveIndex}
                        onPress={(buttonIndex) => {
                                console.log('button clicked :', buttonIndex);
                                if (buttonIndex === 0) {
                                    this.props.handleNewSurvey()
                                }
                                if (buttonIndex === 1) {
                                    this.props.navigation.navigate('InfoScreen')
                                }
                                if (buttonIndex === 2) {
                                    AsyncStorage.clear()
                                    this.props.navigation.navigate('LogInScreen')
                                }
                            }
                        }
                    />
                </View>    
            </View>

                :

            <View style={styles.menu}>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('AdminSelectionScreen')
                }}>
                    <View>
                        <Icon style={{
                            height: 34, width: 30, marginLeft: 8
                        }} size={37} color='#808080' name='ios-people' />
                        <Text style={{ color: '#808080', fontSize: 10.5 }}> Patients </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('AdminChatScreen')
                }}>
                    <View>
                        <Icon style={{
                            height: 30, width: 27, marginLeft: 2.5
                        }} size={33} color={this.props.screen === 'chat' ? '#3377FF' : '#808080'} name='ios-chatboxes' />
                        <Text style={{ color: this.props.screen === 'chat' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Chat </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('ResultsScreen')
                }}>
                    <View>
                        <Icon style={{
                            height: 30, width: 28.5, marginLeft: 2.25
                        }} size={33} color={this.props.screen === 'data' ? '#3377FF' : '#808080'} name='md-pulse' />
                        <Text style={{ color: this.props.screen === 'data' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Data </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('InfoScreen')
                }}>
                    <View>
                        <Icon style={{
                            height: 30, width: 27, marginRight: 1
                                }} size={33} color={this.props.screen === 'info' ? '#3377FF' : '#808080'} name='ios-information-circle-outline' />
                        <Text style={{ color: this.props.screen === 'info' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Info </Text>
                    </View>
                </TouchableHighlight>
            </View>

            }
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
        elevation: 1
    },
});

export default MenuBar