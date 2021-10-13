const router = require('express').Router()

// Registration Route
// localhost:4000/api/users/register
router.post('/register', (req, res) => {

})

// Login Route
// localhost:4000/api/users/login
router.post('/login', (req, res) => {
    let name = req.body.name
    let email = req.body.email
    res.json({
        message: `Welcome ${name}, we will contact with you by ${email}`
    })
})

module.exports = router