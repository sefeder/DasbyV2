import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { ScrollView, StyleSheet } from 'react-native';

class MessageList extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object)
    }

    static defaultProps = {
        messages: [],
    }

    componentDidUpdate = () => {
        this.node.scrollTop = this.node.scrollHeight
    }

    render() {
        return (
            <ScrollView style={styles.messageList} ref={(node) => (this.node = node)}>
                {this.props.messages.map((message, i) => (
                    <Message upi={this.props.upi} channel={this.props.channel} key={i} {...message} memberArray={this.props.memberArray} userPrivateKey={this.props.userPrivateKey}/>
                ))}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    messageList: {
        alignSelf: 'stretch',
    }
});

export default MessageList