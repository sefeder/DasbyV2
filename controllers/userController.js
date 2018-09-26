const db = require('../models')

module.exports = {
    create: function(req, res) {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            hospital: req.body.hospital,
            upi: req.body.upi,
            role: req.body.role
        }
        db.User.create(newUser)
        .then(result => {
            console.log('new user successfully added')
            res.json({user: result})
        })
        .catch(err => console.log(err))
        
    },
    getAllUsers: function(req,res){
        db.User.findAll().then(dbUsers=>res.json(dbUsers))
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
                    res.json({user: dbUser})
                })
            })
            .catch(err=>console.log(err))
    },
    getAdmin: function (req, res) {
        db.User.findAll(
            {
                where: {role: "admin"}
            }
        )
        .then(admin => {
            res.json({admin: admin})
        })
    },
    getUser: function (req, res) {
        db.User.findOne(
            {
                where: { upi: req.body.upi }
            }
        )
        .then(user => {
            res.json({ user: user })
        })
    }

}