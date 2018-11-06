import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView } from 'react-native';
import api from '../utils/api';

export default class ResultsScreen extends Component {

    state = {
        upi: this.props.navigation.state.params.upi,
        results: null
    }

    componentDidMount() {

        api.getResults(this.state.upi, "Depression")
        .then(results => {
            console.log('results from RS getResults: ', results)
            this.setState({results})
        })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <Text style={styles.title}>
                    Results Screen
                </Text>
                <ScrollView>
                    { this.state.results && this.state.results.map((result, idx) => {
                    return(
                    <View key={idx}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',}}>
                        {idx+1})
                    </Text>
                        <Text style={styles.text}>
                            Date: {result.createdAt}
                        </Text>
                        <Text style={styles.text}>
                            Interview ID: {result.interviewId}
                        </Text>
                        <Text style={styles.text}>
                            Test Type: {result.testType}
                        </Text>
                        <Text style={styles.text}>
                            Diagnosis: {result.diagnosis && result.diagnosis}
                        </Text>
                        <Text style={styles.text}>
                            Confidence: {result.confidence && result.confidence}
                        </Text>
                        <Text style={styles.text}>
                            Severity: {result.severity}
                        </Text>
                        <Text style={styles.text}>
                            Category: {result.category}
                        </Text>
                        <Text style={styles.text}>
                            Precision: {result.precision}
                        </Text>
                        <Text style={styles.text}>
                            Probability: {result.probability}
                        </Text>
                        <Text style={styles.text}>
                            Percentile: {result.percentile}
                        </Text>
                    </View>)

                    })
                    }
                </ScrollView>
                
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