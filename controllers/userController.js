const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')

//to register user
exports.postUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    //check if email is already registered
    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: 'email is already registered' })
            }
            else {
                user = await user.save()
                if (!user) {
                    return res.status(400).json({ error: 'unable to create an account' })
                }
                //create token and save it to the token model
                let token= new Token({
                    token:crypto.randomBytes(16).toString('hex'),
                    userId:user._id
                })
                token= await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'failed to create a token' })
                }
                //send email process
                sendEmail({
                    from:'no-reply@ecommerce.com',
                    to:user.email,
                    subject:'Email Verification Link',
                    text:`Hello,\n\n please verify your email by clicking in he below link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`
                    
                })
                res.send(user)
            }
        })


}