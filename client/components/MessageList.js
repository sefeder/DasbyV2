import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { ScrollView, StyleSheet } from 'react-native';
import TypingIndicator from './TypingIndicator'

class MessageList extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object)
    }

    static defaultProps = {
        messages: [],
    }

    componentDidMount() {
        // this.scrollView.scrollToEnd({ animated: false })
    }

    componentDidUpdate() {
        this.scrollView.scrollToEnd({ animated: true })
    }

    render() {
        return (
            <ScrollView style={styles.messageList} ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollView.scrollToEnd({ animated: true });
                }}>
                {this.props.messages && this.props.messages.map((message, i, array) => (
                    <Message 
                        loadingDone={this.props.loadingDone} 
                        sameAsPrevAuthor={message.sameAsPrevAuthor} 
                        upi={this.props.upi} 
                        currentMessageIndex={i}
                        lastMessageIndex={this.props.messages.length-1} 
                        key={i} 
                        {...message} 
                        memberArray={this.props.memberArray} 
                    />
                ))}
                <TypingIndicator prevMessage={this.props.messages && this.props.messages[this.props.messages.length-1]} memberTyping={this.props.memberTyping} isTyping={this.props.isTyping} upi={this.props.upi} memberArray={this.props.memberArray} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    messageList: {
        alignSelf: 'stretch',
        flex: 1
    }
});

export default MessageList