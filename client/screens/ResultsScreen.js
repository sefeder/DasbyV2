import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter, VictoryTheme, VictoryAxis, VictoryCursorContainer, VictoryVoronoiContainer, Line } from 'victory-native';
import MenuBar from '../components/MenuBar';
import moment from 'moment';
import 'moment-timezone';
import Result from '../components/Result';
    
    export default class ResultsScreen extends Component {
        
    state = {
        results:null,
        currentPoints: [],
        averageSeverity: 0,
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
                            () => {
                                this.setState({ averageSeverity: this.state.results.map(result => result.severity).reduce((a, b) => a + b, 0) / this.state.results.length })
                                AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results))
                            }
                        )
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
                                    () => {
                                        this.setState({ averageSeverity: this.state.results.map(result => result.severity).reduce((a, b) => a + b, 0) / this.state.results.length })
                                        AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results))
                                    }
                                )
                            })
                        })
                    })
                })
            }
        })  
    }    

    render() {
        const data = this.state.results && this.state.results.map((result, idx, array) => {
                return { date: array.length - idx, severity: result.severity }
            })
        
        return (
            <KeyboardAvoidingView style={styles.app}>
                <View style={styles.container}>
                    {/* <VictoryChart 
                        width={350} 
                        // theme={VictoryTheme.material}
                        containerComponent={
                            <VictoryVoronoiContainer
                                voronoiDimension="x"
                                onActivated={
                                    (points, props) => {
                                        this.setState({currentPoints: points})
                                    }
                                }
                            />
                        }
                    > */}
                        {/* <VictoryAxis
                            tickValues={this.state.results && this.state.results.map((result, idx) => {
                                return { date: idx + 1 }
                            })}
                        /> */}
                        <VictoryChart
                        containerComponent={
                            <VictoryVoronoiContainer
                                voronoiDimension="x"
                                onActivated={
                                    (points, props) => {
                                        this.setState({ currentPoints: points })
                                    }
                                }
                            />
                        }>
                        <VictoryGroup
                        width={Dimensions.get('window').width*.96} 
                        // theme={VictoryTheme.material}
                        
                        // labels={this.state.results && this.state.results.map((result, idx) => {
                        //     return `${result.severity}`
                        // })}
                            data={this.state.results && data.map((point, idx, array) => {
                                if (this.state.currentPoints[0] && point.date === this.state.currentPoints[0].date) {
                                    const highlightedPoint = {
                                        date: point.date,
                                        severity: point.severity,
                                        size: 8,
                                    }
                                    return highlightedPoint
                                }
                                else {
                                    return point
                                }
                            })
                            }
                        x="date"
                        y="severity" 
                        >
                            <VictoryLine />
                            <VictoryScatter
                                style={{
                                    data: {
                                        fill: (d) => this.state.currentPoints[0] && d.x === this.state.currentPoints[0].date ?  "blue" : "grey",
                                    }
                                }}/>
                        </VictoryGroup>
                        <VictoryGroup>
                            <VictoryLine
                                style={{
                                    data: {stroke: "yellow", strokeWidth: 1},
                                }}
                                labels={["        avg"]}
                                data = {[
                                    { x: 0, y: this.state.averageSeverity},
                                    { x: this.state.results === null ? 0 : this.state.results.length, y: this.state.averageSeverity}
                                ]}
                            />
                        </VictoryGroup>
                    </VictoryChart>
                </View>
                {/* <ScrollView>
                    { this.state.results && this.state.results.map((result, idx, resultArray) => {
                        return(
                            <Result key={idx} prevSeverity={resultArray[idx + 1] !== undefined ? resultArray[idx + 1].severity : null} result={result} date={result.createdAt}/>
                        )
                    })}
                </ScrollView> */}
                <View>
                    {this.state.results && this.state.results.map((result, idx, resultArray) => {
                        if (this.state.currentPoints[0] && resultArray.length-idx === this.state.currentPoints[0].date)
                        return (
                            <Result key={idx} prevSeverity={resultArray[idx + 1] !== undefined ? resultArray[idx + 1].severity : null} result={result} date={result.createdAt} averageSeverity={this.state.averageSeverity}/>
                        )
                        else {
                            return;
                        }
                    })}
                </View>
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
        flex: 2,
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