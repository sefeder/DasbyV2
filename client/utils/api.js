export default {
    getAdmin: () => {
        return fetch('http://91efbe4f.ngrok.io/database/users/get-admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(res => res.json())
    },
    getUser: userUpi => {
        return fetch('http://91efbe4f.ngrok.io/database/users/get-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ upi: userUpi })
        })
            .then(res => res.json())
    },

} 