import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter, VictoryTheme, VictoryAxis, VictoryCursorContainer, VictoryVoronoiContainer, Line, VictoryStack, VictoryArea } from 'victory-native';
import MenuBar from '../components/MenuBar';
import moment from 'moment';
import 'moment-timezone';
import Result from '../components/Result';
    
    export default class ResultsScreen extends Component {
        
    state = {
        results:null,
        currentPoints: [{arrayIndex:0}],
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
                return { date: array.length - idx, severity: result.severity, arrayIndex: idx }
            });
        const correctIndex = this.state.currentPoints[4] ? this.state.currentPoints[4].arrayIndex : this.state.currentPoints[0].arrayIndex 
        
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
                                        this.setState({ currentPoints: points },
                                            () => {
                                                console.log('this.state.currentPoints: ', this.state.currentPoints)
                                                console.log('props: ', props)
                                        })
                                    }
                                }
                            />
                        }>
                            <VictoryStack>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 49 },
                                        { x: this.state.results === null ? 0 : this.state.results.length, y: 49 },
                                    ]}
                                    style={{ data: { fill: "rgba(118, 178, 236, 1)" } }}/>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 16 },
                                        { x: this.state.results === null ? 0 : this.state.results.length, y: 16 },
                                    ]}
                                    style={{ data: { fill: "rgba(78, 142, 204, 1)" } }}/>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 10 },
                                        { x: this.state.results === null ? 0 : this.state.results.length, y: 10 },
                                    ]}
                                    style={{ data: { fill: "rgba(48, 114, 177, 1)" } }}/>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 25 },
                                        { x: this.state.results === null ? 0 : this.state.results.length, y: 25 },
                                    ]}
                                    style={{ data: { fill: "rgba(11, 90, 167, 1)" } }}/>
                            </VictoryStack>
                            <VictoryGroup
                            width={Dimensions.get('window').width*.96} 
                            // theme={VictoryTheme.material}
                            
                            // labels={this.state.results && this.state.results.map((result, idx) => {
                            //     return `${result.severity}`
                            // })}
                                // data={data}
                                data={this.state.results && data.map((point, idx, array) => {
                                    if (this.state.currentPoints[0] && point.arrayIndex === correctIndex) {
                                        const highlightedPoint = {
                                            arrayIndex: point.arrayIndex,
                                            date: point.date,
                                            severity: point.severity,
                                            size: 8,
                                            fill: 'blue'
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
                                    // style={{
                                    //     data: {
                                    //         fill: (d) => (this.state.currentPoints[0] && d.date === this.state.currentPoints[0].date) ?  "blue" : "grey",
                                    //     }
                                    // }}
                                    />
                            </VictoryGroup>
                            <VictoryGroup>
                                <VictoryLine
                                    style={{
                                        data: {stroke: "yellow", strokeWidth: 1},
                                        labels: {fill: 'yellow'}
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
                    {this.state.results &&
                    <Result 
                        prevSeverity={this.state.results[correctIndex + 1] !== undefined ? this.state.results[correctIndex + 1].severity : null} 
                        result={this.state.results[correctIndex]} 
                        date={this.state.results[correctIndex].createdAt} 
                        averageSeverity={this.state.averageSeverity} />
                    }
                    {/* {this.state.results && this.state.results.map((result, idx, resultArray) => {
                        if (this.state.currentPoints[0] && resultArray.length-idx === this.state.currentPoints[0].date)
                            return (
                                <Result key={idx} prevSeverity={resultArray[idx + 1] !== undefined ? resultArray[idx + 1].severity : null} result={result} date={result.createdAt} averageSeverity={this.state.averageSeverity}/>
                            )
                        else {
                            return;
                            // return(
                            //     <Result key={0} prevSeverity={resultArray[1] !== undefined ? resultArray[1].severity : null} result={resultArray[0]} date={resultArray[0].createdAt} averageSeverity={this.state.averageSeverity} />
                            // )
                        }
                    })} */}
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