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
import Spinner from 'react-native-loading-spinner-overlay';
    
    export default class ResultsScreen extends Component {
        
    state = {
        results:null,
        currentIndex: 0,
        currentPoints: [{arrayIndex:0}],
        averageSeverity: 0,
        spinnerVisible: true,
        data: []
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
                                this.setState({ 
                                    spinnerVisible: false,
                                    data: this.cleanUpData(this.state.results),
                                    averageSeverity: this.state.results.map(result => result.severity).reduce((a, b) => a + b, 0) / this.state.results.length 
                                })
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
                                        this.setState({ 
                                            spinnerVisible: false,
                                            data: this.cleanUpData(this.state.results),
                                            averageSeverity: this.state.results.map(result => result.severity).reduce((a, b) => a + b, 0) / this.state.results.length 
                                        })
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

    cleanUpData = (results) =>  {
        if(results){
           const cleanData = results.map((result, idx, array) => {
                        return { date: array.length - idx, severity: result.severity, arrayIndex: idx }
                    });
            return cleanData    
        }
    }       
    
    handlePointTouch = (points, props) => {
        console.log("hitting handlePointTouch. 'this' is: ", this)
        let newIndex 
        if(points.length>2 && points[0].eventKey === 1){ 
            newIndex = 0
        }else if (points.length>2 && points[0].eventKey === 0){
            newIndex = (this.state.results.length-1 )
        }else {
            newIndex = points[0].eventKey
        }
        this.setState({ 
            currentPoints: points,
            currentIndex: newIndex
        },
            () => {
                console.log('this.state.currentPoints: ', this.state.currentPoints)
                console.log('props: ', props)
                this.highlightPoint(this.state.data, this.state.currentIndex)
        })
    }

    highlightPoint = (data, highlightIndex) => {
        const newDataArray = data.map((point, idx, array) => {
            if (point.arrayIndex === highlightIndex) {
                return{
                    arrayIndex: point.arrayIndex,
                    date: point.date,
                    severity: point.severity,
                    size: 8,
                    fill: 'blue'
                }
            }
            else {
                return{
                    arrayIndex: point.arrayIndex,
                    date: point.date,
                    severity: point.severity,
                    size: 3,
                    fill: 'grey'
                }
            }
        })
        this.setState({data: newDataArray})
    }

    render() {

        return (
            <KeyboardAvoidingView style={styles.app}>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Loading Results...'}
                    textStyle={{ color: 'rgba(91, 141, 249, 1)'}}
                    cancelable={false}
                    color={'#3377FF'}
                    animation={'fade'}
                    overlayColor={'rgba(255, 255, 255, 1)'}
                />
                <View style={styles.container}>
                        <VictoryChart
                        containerComponent={
                            <VictoryVoronoiContainer
                                voronoiDimension="x"
                                // onActivated={this.handlePointTouch}
                            />
                        }>
                            <VictoryStack>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 49 },
                                        { x: this.state.results === null ? 1 : this.state.results.length+1, y: 49 },
                                    ]}
                                    style={{ data: { fill: "rgba(118, 178, 236, 1)" } }}/>

                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 16 },
                                        { x: this.state.results === null ? 1 : this.state.results.length+1, y: 16 },
                                    ]}
                                    style={{ data: { fill: "rgba(78, 142, 204, 1)" } }}/>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 10 },
                                        { x: this.state.results === null ? 1 : this.state.results.length+1, y: 10 },
                                    ]}
                                    style={{ data: { fill: "rgba(48, 114, 177, 1)" } }}/>
                                <VictoryArea 
                                    data={[
                                        { x: 0, y: 25 },
                                        { x: this.state.results === null ? 1 : this.state.results.length+1, y: 25 },
                                    ]}
                                    style={{ data: { fill: "rgba(11, 90, 167, 1)" } }}/>
                            </VictoryStack>
                            {this.state.data.length>0 && <VictoryGroup
                                width={Dimensions.get('window').width*.96} 
                                data={this.state.data}
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
                            </VictoryGroup>}
                            <VictoryGroup>
                                <VictoryLine
                                    style={{
                                        data: {stroke: "yellow", strokeWidth: 1},
                                        labels: {fill: 'yellow'}
                                    }}
                                    labels={["        avg"]}
                                    data = {[
                                        { x: 0, y: this.state.averageSeverity},
                                        { x: this.state.results === null ? 1 : this.state.results.length+1, y: this.state.averageSeverity}
                                    ]}
                                />
                            </VictoryGroup>
                    </VictoryChart>
                </View>
                {/* <View>
                    {this.state.results &&
                    <Result 
                        prevSeverity={this.state.results[this.state.currentIndex + 1] !== undefined ? this.state.results[this.state.currentIndex + 1].severity : null} 
                        result={this.state.results[this.state.currentIndex]} 
                        date={this.state.results[this.state.currentIndex].createdAt} 
                        averageSeverity={this.state.averageSeverity} />
                    }
                </View> */}
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