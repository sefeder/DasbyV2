const db = require('../models')

module.exports = {
    create: function(req, res) {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            hospital: req.body.hospital,
            upi: req.body.upi
        }
        db.User.create(newUser)
        .then(result => {
            console.log('new user successfully added')
            res.json(result)
        })
        .catch(err => console.log(err))
        
    }
}