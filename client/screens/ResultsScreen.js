import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter } from 'victory-native';
import MenuBar from '../components/MenuBar';
import moment from 'moment';
import 'moment-timezone';
import Result from '../components/Result'

export default class ResultsScreen extends Component {

    state = {
        results: null
    }

    componentDidMount() {
        AsyncStorage.getItem('currentUserUpi', (err,result)=>{
            if (err) console.log(err)
            if (result !== null) {
                api.getResults(JSON.parse(result), "Depression")
                    .then(results => {
                        console.log('results from RS getResults: ', results)
                        this.setState({ results },
                            () => AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results)))
                    })

            } else {
                AsyncStorage.getItem('surveyResults', (err, result) => {
                    if (err) console.log(err)
                    if (result !== null) {
                        this.setState({ results: JSON.parse(result) })
                    }
                    else {
                        AsyncStorage.getItem('userInfo', (err, result) => {
                            api.getResults(JSON.parse(result).user.upi, "Depression")
                            .then(results => {
                                console.log('results from RS getResults: ', results)
                                this.setState({ results },
                                    () => AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results)))
                            })
                        })
                    }
                })
            }
        })  
    }

    

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <ScrollView>
                    { this.state.results && this.state.results.map((result, idx) => {
                        let formattedDate = moment(result.createdAt).format('MMM Do, YYYY')
                        console.log('this.state.results[idx - 1]: ', this.state.results[idx - 1])
                        return(
                            <Result key={idx} prevSeverity={this.state.results[idx - 1] !== undefined ? this.state.results[idx - 1].severity : null} result={result} date={formattedDate}/>
                        )
                    })}
                </ScrollView>
                <MenuBar navigation={this.props.navigation} screen={'data'} />
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
    }
});