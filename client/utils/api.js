import config from "../config.json";

export default {
    createUser: newUser => {
       return fetch(`${config.apiUrl}/database/users/createNewUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(newUser)
        })
            .then(res => res.json())
    },
    logIn: userInfo => {
       return fetch(`${config.apiUrl}/database/users/logIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userInfo)
        })
            .then(res => res.json())
    },
    getAdmin: () => {
        return fetch(`${config.apiUrl}/database/users/get-admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(res => res.json())
    },
    getUser: userUpi => {
        return fetch(`${config.apiUrl}/database/users/get-user`, {
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