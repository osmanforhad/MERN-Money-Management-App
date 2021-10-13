const registerValidator = require('../validator/registerValidator')

// login controller
module.exports = {
    login: (req, res) => {
        let name = req.body.name
        let email = req.body.email
        res.json({
            message: `Welcome ${name}, we will contact with you by ${email}`
        })
    },
    register: (req, res) => {
        // red client data
        let { name, email, password, confirmPassword } = req.body
        // check user data validation
        let validate = registerValidator({ name, email, password, confirmPassword })
        if (!validate.isValid) {
            res.status(400).json(validate.error)
        } else {
            res.status(200).json({
                message: "Everything is okey"
            })
        }
    }
}