import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native';
import { VirgilCrypto } from 'virgil-crypto';
import virgil from '../utils/virgilUtil';


class Message extends Component {
    static propTypes = {
        author: PropTypes.string,
        // body: PropTypes.string.isRequired,
        me: PropTypes.bool,
    }

    determineAuthor = (authorUpi) => {
        if(this.props.upi === authorUpi){
            return <Text style={styles.me}> Me: </Text>
        }
        for(let i=0; i< this.props.memberArray.length; i++){
            if (this.props.memberArray[i].upi === authorUpi) {
                return < Text style={styles.author} > {this.props.memberArray[i].firstName}: </Text >
            }
        }
    }

    decryptMessage = (encrytpedMessage) => {
        const virgilCrypto = new VirgilCrypto();
        const rawMessage = encrytpedMessage;
        console.log("inside decryptMessage - rawMessage: ", rawMessage)
        const channelPrivateKeyBytes = this.props.channel.attributes.privateKey;
        console.log("inside decryptMessage - channelPrivateKeyBytes: ", channelPrivateKeyBytes)
        const userPrivateKey = this.props.userPrivateKey;
        const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, userPrivateKey)
        console.log("inside decryptMessage - decryptedChannelPrivateKeyBytes: ", decryptedChannelPrivateKeyBytes)
        const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
        console.log("inside decryptMessage - channelPrivateKey: ", channelPrivateKey)
        const decryptedMessage = virgilCrypto.decrypt(rawMessage, channelPrivateKey).toString('utf8')
        console.log("inside decryptMessage - decryptedMessage: ", decryptedMessage)
        return < Text> {decryptedMessage} </Text >
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                {/* {this.props.upi === this.props.author ? <Text style={styles.me}> Me: </Text> : this.props.author && (<Text style={styles.author}> {this.props.author}: </Text>)} */}

                {this.determineAuthor(this.props.author)}
                < Text>
                    {this.decryptMessage(this.props.body)}
                </Text>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    author: {
        color: 'red',
        fontWeight: 'bold'
    },
    me: {
        color: 'grey',
        fontWeight: 'bold'
    }
});

export default Message