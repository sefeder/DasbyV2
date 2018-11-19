import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, AsyncStorage } from 'react-native';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment-timezone';
import * as Animatable from 'react-native-animatable';

class Result extends Component {

    state = {
        contentVisible: false
    }

    componentDidMount() {
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

    determineTriangle = (prevSeverity, severity) => {
        if (prevSeverity === null || prevSeverity === severity) {
            return < Entypo size={37} color='black' name={'minus'} />
        }
        else if (prevSeverity > severity) {
            return < Entypo size={37} color='green' name={'triangle-down'} />
        }
        else if (prevSeverity < severity) {
            return < Entypo size={37} color='red' name={'triangle-up'} />
        }
    }

    render() {
        return (
            <View>
                    <TouchableHighlight style={{
                        height: Dimensions.get('window').height * .055,
                        width: Dimensions.get('window').width,
                        backgroundColor: this.determineBackgroundColor(this.props.result.severity),
                        borderBottomColor: 'black',
                        borderBottomWidth: this.state.contentVisible ? 0 : 1.5, 
                        }} underlayColor={this.determineBackgroundColor(this.props.result.severity)} onPress={() => this.setState({ contentVisible: !this.state.contentVisible })}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'}}>
                            <View style={styles.resultHeader}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                    {this.props.date}
                                </Text>
                                <Text style={{ fontSize: 16, marginLeft: 5 }}>
                                    ({moment(`${this.props.date}`, 'MMM Do, YYYY').fromNow()})
                                    </Text>
                            </View>
                            <MaterialIcons size={40} color='black' name={'menu'}/>
                        </View>
                        
                    </TouchableHighlight>
                    {this.state.contentVisible &&
                    <Animatable.View animation="slideInDown" style={styles.resultContent}>

                        <Text style={{ fontSize: 22, marginLeft: 10, fontWeight: 'bold', color: this.determineBackgroundColor(this.props.result.severity)}}>
                        {this.capitalizeFirstLetter(this.props.result.category)}
                        </Text>

                        <View style={{ marginLeft: 10}}>
                            {this.determineTriangle(this.props.prevSeverity, this.props.result.severity)}
                        </View>

                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 5, color: this.determineBackgroundColor(this.props.result.severity)}}>
                            {this.props.result.severity}
                        </Text>

                    </Animatable.View>
                    }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    resultHeader: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    resultContent: {
        backgroundColor: '#434346',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1.5
    }
});

export default Result