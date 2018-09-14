export default {
    getAdmin: () => {
       return fetch('http://localhost:3000/database/users/get-admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(res => res.json())
    }
} 