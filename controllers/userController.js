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
            console.log('userController create method result: ', result)
            res.json({user: result})
        })
        .catch(err => console.log(err))
        
    },
    authenticateUser: function(req, res) {
            db.User.findOne({
                where: {
                    email: req.body.email,
                }
            }).then(function (data) {
                if (!data) {
                    res.json({status: false, message: "invalid email"})
                    console.log('invalid email')
                    return;
                }
                if (data.password !== req.body.password) {
                    res.json({ status: false, message: "password does not match" })
                    console.log('incorrect password')
                    return;
                }
                res.json({ status: true, message: "login successful", user: data })
                
            }).catch(function (error) {
                console.log(error)
                res.send(error);
            })
        },
    update: function (req, res) {
            db.User.update(
                { private_key: JSON.stringify(req.body.privateKey) },
                {
                    where: { upi: req.body.upi }
                }
            )
            .then(() => {
                db.User.findOne({
                    where: {upi: req.body.upi}

                })
                .then( dbUser => {
                    console.log('data after pkey update happens: ', dbUser)
                    res.json({user: dbUser})
                })
            })
            .catch(err=>console.log(err))
    },
    getAdmin: function (req, res) {
        db.User.findOne(
            {
                where: {role: "admin"}
            }
        )
        .then(admin => {
            console.log('admin found in getAdmin call: ', admin)
            res.json({admin: admin})
        })
    }

}