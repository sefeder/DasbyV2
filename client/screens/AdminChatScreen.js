import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions } from 'react-native';
import twilio from '../utils/twilioUtil';
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';



export default class AdminChatScreen extends Component {

    state = {
        adminInfo: this.props.navigation.state.params.adminInfo,
        channelDescriptor: this.props.navigation.state.params.channelDescriptor,
        channel: null,
        adminPrivateKey: null,
        messages: [],
        memberArray: [],
        isTyping: false,
        memberTyping: null,
    }

    componentDidMount() {
        const startTime = Date.now();
        console.log("----------------------------------------------------------")
        console.log("hitting compoenentDidMount at: ", (Date.now() - startTime) / 1000)
        virgil.getPrivateKey(this.state.adminInfo.upi)
            .then(adminPrivateKey => {
                console.log("Virgil Private Key Retrieved: ", (Date.now() - startTime) / 1000)
                this.setState({
                    adminPrivateKey: adminPrivateKey
                })
            })
            .catch(err => console.log(err))

        this.state.channelDescriptor.getChannel()
        .then(channel => {
            console.log("Channel Gotten from Channel Descriptor: ", (Date.now() - startTime) / 1000)
            this.setState({channel})
            this.configureChannelEvents(channel)
            channel.getMessages().then(result => {
                console.log("Twilio Messages Retrieved: ", (Date.now() - startTime) / 1000)
                console.log("----------------------------------------------------------------------------------------")
                this.setState({
                    messages: result.items.map((message, i, items) => {
                        console.log("Messages Map Function - message #", i, " at: ", (Date.now() - startTime) / 1000)
                        return {
                            author: message.author,
                            body: this.parseIncomingPayloadData(this.decryptMessage(message.body)),
                            me: message.author === this.state.adminInfo.upi,
                            sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author
                        }
                    })
                }, () => {
                    console.log("---------------------END SET STATE MESSAGES-----------------------", (Date.now() - startTime) / 1000)
                })
            })
            channel.getMembers().then(result => {
                console.log("Channel Members Gotten: ", (Date.now() - startTime) / 1000)
                result.forEach((member,i) => {
                    api.getUser(member.identity).then(dbUser => {
                        this.setState({
                            memberArray: [...this.state.memberArray, {
                                upi: dbUser.user.upi,
                                firstName: dbUser.user.first_name,
                                lastName: dbUser.user.last_name
                            }]
                        }, () => {
                            console.log("Set State Member ", i, " at:", (Date.now() - startTime) / 1000)
                        })
                    })
                })
            })
        })
        
    }

    decryptMessage = (encrytpedMessage) => {
        const virgilCrypto = new VirgilCrypto();
        const channelPrivateKeyBytes = this.state.channel.attributes.privateKey;
        const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, this.state.adminPrivateKey)
        const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
        const decryptedMessage = virgilCrypto.decrypt(encrytpedMessage, channelPrivateKey).toString('utf8')
        return decryptedMessage
    }

    canParseStr = str => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    parseIncomingPayloadData = payloadDataString => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            if (payloadData.imageURL || payloadData.videoURL) {
                const message = payloadData
                return message
            } else {
                const message = payloadData.message
                return message
            }
        } else {
            const message = payloadDataString
            return message
        }
    }

// may not need undefined clause in ternary below
    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.state.adminInfo.first_name, sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author }
        this.setState({
            messages: [...this.state.messages, messageData],
        })
    }

    updateTypingIndicator = (memberTyping, isTyping) => {
        if (isTyping) {
            console.log('member typing: ', memberTyping.identity)
            this.setState({ isTyping: true, memberTyping: memberTyping.identity })
        } else {
            console.log("ID " + memberTyping.identity + " has stopped typing")
            this.setState({ isTyping: false, memberTyping: memberTyping.identity })
        }
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body }) => {
            this.addMessage({ author, body: this.parseIncomingPayloadData(this.decryptMessage(body)) })
        })

        //set up the listener for the typing started Channel event
        channel.on('typingStarted', member => {
            //process the member to show typing
            this.updateTypingIndicator(member, true);
        });

        //set  the listener for the typing ended Channel event
        channel.on('typingEnded', member => {
            //process the member to stop showing typing
            this.updateTypingIndicator(member, false);
        });

        // channel.on('memberJoined', (member) => {
        //     this.addMessage({ body: `${member.identity} has joined the channel.` })
        // })

        // channel.on('memberLeft', (member) => {
        //     this.addMessage({ body: `${member.identity} has left the channel.` })
        // })
    }

    handleNewMessage = (text) => {
        if (this.state.channel) {
            const virgilCrypto = new VirgilCrypto();
            const importedPublicKey = virgilCrypto.importPublicKey(this.state.channel.attributes.publicKey)
            const encryptedMessage = virgilCrypto.encrypt(text, importedPublicKey)
            this.state.channel.sendMessage(encryptedMessage.toString('base64'))
        }
    }

render () {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                <Text>
                    Welcome Home {this.state.adminInfo.first_name} {this.state.adminInfo.last_name}
                </Text>
                <MessageList memberTyping={this.state.memberTyping} isTyping={this.state.isTyping} upi={this.state.adminInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray} />
                <MessageForm channel={this.state.channel} onMessageSend={this.handleNewMessage} />
                <View style={styles.menu}>
                    <TouchableHighlight onPress={() => { this.props.navigation.navigate('AdminChatScreen') }}>
                        <Ionicons size={45} color='#808080' name='md-chatboxes' />
                    </TouchableHighlight>
                    <Icon size={45} color='#808080' name='phone' />
                    <TouchableHighlight onPress={() => { this.props.navigation.navigate('AdminSelectionScreen') }}>
                        <Ionicons size={45} color='#808080' name='md-people' />
                    </TouchableHighlight>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


}
const styles = StyleSheet.create({
    app: {
        display: 'flex',
        overflow: 'scroll',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
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
})