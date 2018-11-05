import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';

export default class ResultsScreen extends Component {

    state = {
        surveyResults: this.props.navigation.state.params.surveyResults.results,
    }

    componentDidMount() {
        console.log('this.state.surveyResults: ', this.state.surveyResults)
        console.log('surveyResults: ', this.props.navigation.state.params.surveyResults.results)
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <Text style={styles.title}>
                    Results Screen
                </Text>
                <Text style={styles.text}>
                    Interview ID: {this.state.surveyResults.interviewId}
                </Text>
                <Text style={styles.text}>
                    Test Type: {this.state.surveyResults.testType}
                </Text>
                <Text style={styles.text}>
                    Diagnosis: {this.state.surveyResults.diagnosis && this.state.surveyResults.diagnosis}
                </Text>
                <Text style={styles.text}>
                    Confidence: {this.state.surveyResults.confidence && this.state.surveyResults.confidence}
                </Text>
                <Text style={styles.text}>
                    Severity: {this.state.surveyResults.severity}
                </Text>
                <Text style={styles.text}>
                    Category: {this.state.surveyResults.category}
                </Text>
                <Text style={styles.text}>
                    Precision: {this.state.surveyResults.precision}
                </Text>
                <Text style={styles.text}>
                    Probability: {this.state.surveyResults.probability}
                </Text>
                <Text style={styles.text}>
                    Percentile: {this.state.surveyResults.percentile}
                </Text>
                
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
        justifyContent: 'center',
        marginLeft: 20
    },
    text: {
        fontSize: 18,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center'
    }
});