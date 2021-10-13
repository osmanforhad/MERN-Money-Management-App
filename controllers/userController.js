const bcrypt = require('bcrypt')
const registerValidator = require('../validator/registerValidator')
const User = require('../model/User')

// login controller
module.exports = {
    login: (req, res) => {
        let name = req.body.name
        let email = req.body.email
        res.json({
            message: `Welcome ${name}, we will contact with you by ${email}`
        })
    },
    // register controller
    register: (req, res) => {
        // read client data or destructure
        let { name, email, password, confirmPassword } = req.body
        // check user data validation
        let validate = registerValidator({ name, email, password, confirmPassword })
        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            // check duplicate user is exists by user proivided email
            User.findOne({ email })
                .then(user => {
                    if (user) {
                        return res.status(400).json({
                            messgae: "Email alreday exists"
                        })
                    }

                    // passpord Hasing or bcrypt password
                    bcrypt.hash(password, 11, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Server Error Occurred"
                            })
                        }
                        // create new user
                        let user = new User({
                            name,
                            email,
                            password: hash
                        })
                        // save or rgister user
                        user.save()
                            .then(user => {
                                res.status(201).json({
                                    message: "Registration Successfull",
                                    user
                                })
                            })
                            .catch(error => {
                                console.log(error)
                                res.status(500).json({
                                    message: "Server Error Occurred"
                                })
                            })
                    })
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({
                        message: "Server Error Occurred"
                    })
                })
        }
    }
}