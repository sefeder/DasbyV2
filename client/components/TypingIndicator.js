import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native';
import { VirgilCrypto } from 'virgil-crypto';
import virgil from '../utils/virgilUtil';


class TypingIndicator extends Component {
    static propTypes = {
        author: PropTypes.string,
        // body: PropTypes.string.isRequired,
        me: PropTypes.bool,
        // sameAsPrevAuthor: PropTypes.bool,
        isTyping: PropTypes.bool,
        memberTyping: PropTypes.string
    }

    //this.props.sameAsPrevAuthor ? <View style={styles.notMeBubble}>< Text style={styles.notMeMessageText}>TYPING</Text></View> :

    showTypingIndicator = (memberTyping) => {
        if (memberTyping !== this.props.upi) {
            for (let i = 0; i < this.props.memberArray.length; i++) {
                if (this.props.memberArray[i].upi === memberTyping) {
                    return <View><Text style={styles.notMeAuthor}>{this.props.memberArray[i].firstName}</Text><View style={styles.notMeBubble}>< Text selectable style={styles.notMeMessageText}>TYPING</Text></View></View>
                }
            }
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'column' }}>
                {this.props.isTyping ? this.showTypingIndicator(this.props.memberTyping) : <View />}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    notMeBubble: {
        backgroundColor: '#D5D6D7',
        alignSelf: 'flex-start',
        maxWidth: 300,
        padding: 10,
        borderRadius: 20,
        marginBottom: 2.5,
        marginLeft: 25
    },
    notMeMessageText: {
        fontSize: 18
    },
    notMeAuthor: {
        marginLeft: 35,
        marginTop: 10,
        marginBottom: 2.5
    }
});

export default TypingIndicator