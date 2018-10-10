import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

class QuickReply extends Component {

    state = {
        textInput: null,
        height: 0
    }

    handleSubmit = (text) => {
        this.props.onMessageSend(text)
    }

    render() {
        return (
            <View >
                < View style={styles.quickReplyView}>
                    {this.props.responseArray.map((response, idx) => {
                        return [
                        <TouchableHighlight onPress={()=>this.handleSubmit(JSON.stringify(response))}style={styles.submitButton} key={idx}>
                            <Text>
                                {response.message}
                            </Text>
                        </TouchableHighlight>
                        ]
                    })}
                </View >
                
            </View >
        )
    }

}
const styles = StyleSheet.create({
    quickReplyView: {
        height: 70,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    submitButton: {
        backgroundColor: '#3377FF',
        width: 50,
        padding: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 5
    },
    disabledSubmitButton: {
        backgroundColor: '#D5D6D7',
        width: 50,
        padding: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 5
    }
});

export default QuickReply