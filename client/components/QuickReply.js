import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

class QuickReply extends Component {

    state = {
        textInput: null,
        height: 0
    }

    handleSubmit = (responseObject) => {
        responseObjectString = JSON.stringify(responseObject)
        this.props.onMessageSend(responseObjectString)
        if(responseObject.chapter === "Survey"){
            this.props.handleNewSurvey();  
        }
    }

    render() {
        return (
            <View >
                < View style={styles.quickReplyButtonView}>
                    {this.props.isQrVisible &&
                        this.props.responseArray.map((responseObject, idx) => {
                            return [
                                <TouchableHighlight onPress={() => this.handleSubmit(responseObject)} style={styles.quickReplyButton} key={idx}>
                                    <Text style={styles.quickReplyText}>
                                    {responseObject.message}
                                    </Text>
                            </TouchableHighlight>
                            ]
                        })
                    }
                </View >
                
            </View >
        )
    }

}
const styles = StyleSheet.create({
    quickReplyButtonView: {
        height: 70,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 1
        },
        zIndex: 10
    },
    quickReplyButton: {
        backgroundColor: 'white',
        borderColor: '#3377FF',
        borderWidth: 2,
        width: 100,
        padding: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    quickReplyText: {
        color: '#3377FF'
    }
});

export default QuickReply