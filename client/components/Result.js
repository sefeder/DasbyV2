import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, AsyncStorage } from 'react-native';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment-timezone';
import * as Animatable from 'react-native-animatable';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter, VictoryTheme, VictoryAxis, VictoryCursorContainer, VictoryVoronoiContainer, Line, VictoryAnimation, VictoryPie, VictoryLabel  } from 'victory-native';
import { Svg } from 'react-native-svg';

class Result extends Component {

    state = {
        percent: 0,
        data: this.getData(0)
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                percent: this.props.result.severity, data: this.getData(this.props.result.severity)
            });
        }, 100);
    }

    componentWillReceiveProps() {
        setTimeout(() => {
            this.setState({
                percent: this.props.result.severity, data: this.getData(this.props.result.severity)
            });
        }, 100);
    }

    componentWillUnmount() {
        window.clearInterval(this.setStateInterval);
    }

    getData(percent) {
        return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
    }


    capitalizeFirstLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    determineBackgroundColor = severity => {
        let score = parseInt(severity)
        switch (true) {
            case (score < 50):
                return 'rgba(118, 178, 236, 1)'
                break;
            case (score >= 50 && score <= 65):
                return 'rgba(78, 142, 204, 1)'
                break;
            case (score > 65 && score <= 75):
                return 'rgba(48, 114, 177, 1)'
                break;
            case (score > 75):
                return 'rgba(11, 90, 167, 1)'
                break;
            
            default:
                break;
        }
    }

    determineTriangle = (referenceSeverity, severity) => {
        if (referenceSeverity === null || referenceSeverity === severity) {
            return < Entypo size={37} color='black' name={'minus'} />
        }
        else if (referenceSeverity > severity) {
            return < Entypo size={37} color='green' name={'triangle-down'} />
        }
        else if (referenceSeverity < severity) {
            return < Entypo size={37} color='red' name={'triangle-up'} />
        }
    }

    determineDelta = (referenceSeverity, severity, referenceName) => {
        let delta;
        if(referenceSeverity === null){
            delta = "(no previous data)"
        }else if(referenceSeverity === severity){
            delta = `same as ${referenceName}`
        }else{
            delta = (severity - referenceSeverity).toFixed(1)
            if (delta > 0) {
                delta = `+${delta}`
            }
            delta = `${delta} from ${referenceName}`
        }
        
        return <Text style={{color:"white", fontSize: 15}}> 
            {this.determineTriangle(referenceSeverity, severity)} {delta}
        </Text>
    }

    render() {
        return (
            <View>
                <View style={{
                    marginTop: 5,
                    height: Dimensions.get('window').height * .40,
                    width: Dimensions.get('window').width,
                    backgroundColor: '#434346',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap'

                    }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height * .07
                    }}>
                        <View style={styles.resultHeader}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white' }}>
                                {/* Don't understand .utcOffset() below works for central time though*/}
                                {moment(moment(this.props.date).utcOffset(0, true).valueOf()).format('MMM Do, YYYY')}
                            </Text>
                            <Text style={{ fontSize: 18, marginLeft: 5, color: 'white' }}>
                                ({moment(this.props.date).utcOffset(0, true).fromNow()})
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        width: 200,
                        height: 200
                    }}>
                        <Text style={{ fontSize: 28, marginLeft: 10, fontWeight: 'bold', color: 'white' }}>
                            {this.capitalizeFirstLetter(this.props.result.category)}
                        </Text>

                        <View style={{ marginLeft: 10 }}>
                            {/* {this.determineTriangle(this.props.prevSeverity, this.props.result.severity)} */}
                            {this.determineDelta(this.props.prevSeverity, this.props.result.severity, 'previous')}
                            {this.determineDelta(this.props.averageSeverity, this.props.result.severity, 'average')}
                        </View>
                       
                    </View>
                    <Svg width="200" height="200">
                        <VictoryPie
                            standalone={false}
                            animate={{ duration: 1000 }}
                            width={200} height={200}
                            data={this.state.data}
                            innerRadius={75}
                            cornerRadius={5}
                            labels={() => null}
                            style={{
                                data: {
                                    fill: (d) => {
                                        const color = this.determineBackgroundColor(d.y);
                                        return d.x === 1 ? color : "transparent";
                                    }
                                }
                            }}
                        />
                        <VictoryAnimation duration={1000} data={this.state}>
                            {(newProps) => {
                                return (
                                    <VictoryLabel
                                        textAnchor="middle" verticalAnchor="middle"
                                        x={100} y={100}
                                        text={`${Math.round(newProps.percent * 10) / 10}`}
                                        style={{ fontSize: 38, fill: this.determineBackgroundColor(this.props.result.severity) }}
                                    />
                                );
                            }}
                        </VictoryAnimation>
                    </Svg>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    resultHeader: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    resultContent: {
        backgroundColor: '#434346',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1.5
    }
});

export default Result