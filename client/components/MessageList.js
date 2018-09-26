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

    render() {
        return (
            <ScrollView style={styles.messageList} ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollView.scrollToEnd({ animated: true });
                }}>
                {this.props.messages.map((message, i) => (
                    <Message sameAsPrevAuthor={message.sameAsPrevAuthor} upi={this.props.upi} key={i} {...message} memberArray={this.props.memberArray}/>
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