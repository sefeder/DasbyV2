import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

class MessageForm extends Component {
   
    state = {
        textInput: null,
        height: 0
    }

    handleSubmit = (text) => {
        this.props.onMessageSend(text)
        this.setState({
            textInput: null 
        })
    }

    render() {
        return (
            <View style={{
                flexDirection: 'row',
                width: 380,
                margin: 10,
                padding: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: '#888',
                borderRadius: 5,
                backgroundColor: '#fff',
                height: Math.max(45, this.state.height)
            }}>
                < View style={{flex: 1}}>
                    <TextInput
                        onChangeText={(textEntry) => { this.setState({ textInput: textEntry }) }}
                        value={this.state.textInput}
                        placeholder= 'Type here'
                        multiline
                        onContentSizeChange={event => {
                            this.setState({ height: event.nativeEvent.contentSize.height })
                        }}
                        style={{ backgroundColor: 'transparent', fontSize: 18, width: 308, height: Math.max(35, this.state.height) }}
                    />
                </View >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {this.state.textInput !== null && this.state.textInput !== '' ?
                    <TouchableOpacity
                        onPress={() => this.handleSubmit(this.state.textInput)}
                        style={styles.submitButton}
                        >
                        <Text style={{ color: 'white' }}>Send</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        disabled
                        style={styles.disabledSubmitButton}
                    >
                        <Text style={{ color: 'white' }}>Send</Text>
                    </TouchableOpacity>
                }
                </View>
            </View >
        )
    }

}
const styles = StyleSheet.create({
   
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

export default MessageForm