import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import api from '../utils/api';

export default class SurveyScreen extends Component {

    state = {
        upi: this.props.navigation.state.params.upi,
        currentQuestion: null 
    }

    componentDidMount() {
        api.getCatmhSurvey("dep", this.state.upi)
        .then(res => {
            console.log('should be first q: ', res)
            this.setState({currentQuestion: res})
        })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <Text>
                Welcome to the Suvey Page!!!
                We're Glad You're Here...
                </Text>
                {this.state.currentQuestion && 
                <View>
                    <Text style={styles.text}>
                        {this.state.currentQuestion.questionDescription}
                    </Text>
                    {this.state.currentQuestion.questionAnswers.map((answer, idx)=>{
                        return <TouchableHighlight key={idx} style={styles.button}>
                                <Text style={styles.buttonText}>
                                        {answer.answerDescription}
                                    </Text>
                                </TouchableHighlight>
                    })}
                </View>
                }
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
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 40,
        width: 300,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20
    }
});