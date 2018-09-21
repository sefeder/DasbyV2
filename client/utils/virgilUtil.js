import { VirgilCrypto, VirgilCardCrypto } from 'virgil-crypto'
import { CardManager, VirgilCardVerifier, CachingJwtProvider, KeyStorage } from 'virgil-sdk';

export default {
    initializeVirgil: (upi, password) => {
        return new Promise((resolve, reject) => {
            const virgilCrypto = new VirgilCrypto();
            const virgilCardCrypto = new VirgilCardCrypto(virgilCrypto);
            const privateKeyStorage = new KeyStorage();
            const cardManager = new CardManager({
                cardCrypto: virgilCardCrypto,
                cardVerifier: new VirgilCardVerifier(virgilCardCrypto)
            });
            const keyPair = virgilCrypto.generateKeys();

            
            // Get the raw private key bytes
            // Virgil Crypto exports the raw key bytes in DER format
            const privateKeyBytes = virgilCrypto.exportPrivateKey(keyPair.privateKey, password);
            console.log('exported privateKey: ', privateKeyBytes)

            fetch('http://91efbe4f.ngrok.io/database/users/update',
            {
                method: 'POST',
                body: JSON.stringify({
                    privateKey: privateKeyBytes,
                    upi: upi
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then( updatedUser => {
                console.log('privateKey stored in db')
                console.log('updatedUser: ', updatedUser)
                resolve(updatedUser)
            })
            .catch(err=>console.log(err))
        
            console.log('upi: ', upi)
            console.log('password: ', password)
            const rawCard = cardManager.generateRawCard({
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey,
                identity: upi
            });
            fetch('http://91efbe4f.ngrok.io/services/signup', {
                method: 'POST',
                body: JSON.stringify({ rawCard }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json())
                .then(result => {
                    console.log('virgilUtil line 56 result: ',result)
                    const publishedCard = cardManager.importCardFromJson(result.virgil_card);
                    console.log('virgilUtil line 58 publishedCard: ', publishedCard)
                    // resolve(publishedCard)
                }).catch(err => console.log(err));
        }).catch(err => console.log(err))
    }
}