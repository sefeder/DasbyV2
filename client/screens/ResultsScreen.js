import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter, VictoryTheme } from 'victory-native';
import MenuBar from '../components/MenuBar';
import moment from 'moment';
import 'moment-timezone';
import Result from '../components/Result';
    
    export default class ResultsScreen extends Component {
        
    state = {
        results: null
    }

    componentDidMount() {
        AsyncStorage.getItem('currentUserUpi', (err,result)=>{
            if (err) console.log(err)
            //below is only true if admin is currently logged in
            if (result !== null) {
                api.getResults(JSON.parse(result), "Depression")
                    .then(results => {
                        console.log('results from RS getResults: ', results)
                        this.setState({ results },
                            () => AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results)))
                    })
            //below pertains to users being logged in
            } else {
                AsyncStorage.getItem('surveyResults', (err, result) => {
                    if (err) console.log(err)
                    this.setState({ results: JSON.parse(result) },
                    () => {
                        AsyncStorage.getItem('userInfo', (err, result) => {
                            api.getResults(JSON.parse(result).user.upi, "Depression")
                            .then(results => {
                                console.log('results from RS getResults: ', results)
                                this.setState({ results },
                                    () => AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results)))
                            })
                        })
                    })
                })
            }
        })  
    }

    

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <View style={styles.container}>
                    <VictoryGroup width={350} theme={VictoryTheme.material}>
                        <VictoryBar 
                        labels={this.state.results && this.state.results.map((result, idx) => {
                            return `${result.severity}`
                        })}
                        data={this.state.results && this.state.results.map((result, idx) => {
                            return { date: result.createdAt, severity: result.severity }
                        })}
                        x="date"
                        y="severity" />
                    </VictoryGroup>
                </View>
                <ScrollView>
                    { this.state.results && this.state.results.map((result, idx, resultArray) => {
                        return(
                            <Result key={idx} prevSeverity={resultArray[idx + 1] !== undefined ? resultArray[idx + 1].severity : null} result={result} date={result.createdAt}/>
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
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#d9d9d9',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 7,
        shadowOffset: {
            height: 1,
            width: 1
        },
        zIndex: 10
    
    }

});