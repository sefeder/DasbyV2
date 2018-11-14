import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter } from 'victory-native';
import MenuBar from '../components/MenuBar';
import Moment from 'moment';
import 'moment-timezone';

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
                <ScrollView style={styles.scrollView}>
                    { this.state.results && this.state.results.map((result, idx) => {
                    return(
                    <View key={idx}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',}}>
                        {this.state.results.length-idx})
                    </Text>
                        <Text style={styles.text}>
                                Date: {Moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                        </Text>
                        <Text style={styles.text}>
                            Severity: {result.severity}
                        </Text>
                        <Text style={styles.text}>
                            Category: {result.category}
                        </Text>
                        
                    </View>)

                    })
                    }
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
    scrollView: {
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
    },
    menu: {
        display: 'flex',
        borderTopColor: 'black',
        borderTopWidth: .2,
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height * .055,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10
    },
});