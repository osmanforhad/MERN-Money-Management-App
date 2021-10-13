const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const registerValidator = require('../validator/registerValidator')
const loginValidator = require('../validator/loginValidator')
const User = require('../model/User')
const { serverError, resourceError } = require('../util/error')

// login controller
module.exports = {
    login(req, res) {
        // Extract Data from user request or destructure
        let { email, password } = req.body
        // User data Validation
        let validate = loginValidator({ email, password })
        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }
        // Check for user Availability
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return resourceError(res, "User not Found")
                }
                // Compare user password with database
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return serverError(res, err)
                    }
                    if (!result) {
                        return resourceError(res, "Password Doesn\'t Match")
                    }
                    // Generate Token and Response Back
                    let token = jwt.sign({
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }, 'loginData', { expiresIn: '2h' })
                    res.status(200).json({
                        message: "Login Successfull",
                        token: `Bearer ${token}`
                    })
                })
            })
            .catch(error => serverError(res, error))
    },
    // register controller
    register(req, res) {
        // read client data or destructure
        let { name, email, password, confirmPassword } = req.body
        // check user data validation
        let validate = registerValidator({ name, email, password, confirmPassword })
        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        } else {
            // check duplicate user is exists by user proivided email
            User.findOne({ email })
                .then(user => {
                    if (user) {
                        return resourceError(res, "Email alreday exists")
                    }

                    // passpord Hasing or bcrypt password
                    bcrypt.hash(password, 11, (err, hash) => {
                        if (err) {
                            return resourceError(res, "Server Error Occurred")
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
                            .catch(error => serverError(res, error))
                    })
                })
                .catch(error => serverError(res, error))
        }
    }
};