const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')
const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')

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
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id
                })
                token = await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'failed to create a token' })
                }
                //send email process
                //send Email process 
                const url=process.env.FRONTEND_URL+'\/email\/confirmation\/'+token.token
                //http:localhost:3000/email/confirmation/6y62
                sendEmail({
                    from: 'no-reply@ecommerce.com',
                    to: user.email,
                    subject: 'Email Verification Link',
                    text: `Hello,\n\n please verify your email by clicking in he below link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
                    html:`
                    <h1>Verify Your Email Account</h1>
                    <a href=${url}> Click to verify </a>
                    `
                    //http://localhost:8000/api/confirmation/5466464
                })
                res.send(user)
            }
        })
}

//post email confirmation
exports.postEmailConfirmation = (req, res) => {
    //at first find the valid or matching token
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                return res.status(400).json({ error: 'invalid token or token may have expired' })
            }
            //if we found the valid token then find the valid user for that token
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(400).json({ error: 'we are unable to find the valid user for this token' })
                    }
                    // check if user is already verified or not
                    if (user.isVerified) {
                        return res.status(400).json({ error: 'email is already verified, please login to continue' })
                    }
                    // save the verified user
                    user.isVerified = true
                    user.save()
                        .then(user => {
                            if (!user) {
                                return res.status(400).json({ error: 'failed to verify the email' })
                            }
                            res.json({ message: 'congrats, your email has been verified successfully' })
                        })
                        .catch(err => {
                            return res.status(400).json({ error: err })
                        })
                })
                .catch(err => {
                    return res.status(400).json({ error: err })
                })
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

//signin process
exports.signIn = async (req, res) => {
    const { email, password } = req.body
    //at first check if email is registered in the system or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(503).json({ error: 'sorry the email you provided is not found in our system, register first or try another' })
    }
    //if email found then check the password for the email
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: 'email and password doesnot match' })
    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: 'verify email first to continue' })
    }
    //now generate token with user id and jwt secret
    const token = jwt.sign({ _id: user._id,role:user.role }, process.env.JWT_SECRET)
    //store token in the cookie
    res.cookie('myCookie', token, { expire: Date.now() + 99999 })
    //return user information to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { name, role, email, _id } })
}
//forget password
exports.forgetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ error: 'sorry the email you provided is not found in our system, register first or try another' })
    }

    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'failed to create a token' })
    }
    //send email process
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'Password Reset Link',
        text: `Hello,\n\n please reset your email by clicking in he below link:\n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`
        //http://localhost:8000/api/resetpassword/5466464
    })
    res.json({message:'password reset link has been sent successfully '})
}

//reset password
exports.resetPassword=async(req,res)=>{
    // find the valid token
    let token = await Token.findOne({token:req.params.token})
    if (!token) {
        return res.status(400).json({ error: 'invalid token or token may have expiredd' })
    }
    // if we found the vald token then find the valid user for that token   
    let user = await User.findOne({_id:token.userId})
    if (!user) {
        return res.status(400).json({ error: 'we are unable to find the valid user for this token' })
    }
    // reset the password
    user.password=req.body.password
    user= await user.save()
    if (!user) {
        return res.status(500).json({ error: 'failed to reset password' })
    }
    res.json({message:'password has been reset successfully, login to continue'})
}

//user list
exports.userList=async(req,res)=>{
    const user = await User.find()
    .select('-hashed_password')//- to remove from list
    .select('-salt')
    if (!user) {
        return res.status(500).json({ error: 'something went wrong' })
    }
    res.send(user)
}

// user details
exports.userDetails=async(req,res)=>{
    const user = await User.findById(req.params.id)
    .select('-hashed_password')//- to remove from list
    .select('-salt')
    if (!user) {
        return res.status(500).json({ error: 'something went wrong' })
    }
    res.send(user)
}

//signout
exports.signOut=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout successful'})
}

//require signin
exports.requireSignin=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth'
})

// middleware for user role
exports.requireUser=(req,res,next)=>{
    //verify JWT
    expressjwt({
        secret:process.env.JWT_SECRET,
        algorithms:['HS256'],
        userProperty:'auth'
    })(req,res,(err)=>{
        if (err){
            return res.status(400).json({error:'Unauthorized'})
        }
        // check the role
        if(req.auth.role===0){
            // grant access
            next()
        } else{
            //unauthorized role
            return res.status(403).json({error:'Forbidden'})
        }
    })
}

// middleware for admin role
exports.requireAdmin=(req,res,next)=>{
    //verify JWT
    expressjwt({
        secret:process.env.JWT_SECRET,
        algorithms:['HS256'],
        userProperty:'auth'
    })(req,res,(err)=>{
        if (err){
            return res.status(400).json({error:'Unauthorized'})
        }
        // check the role
        if(req.auth.role===1){
            // grant access
            next()
        } else{
            //unauthorized role
            return res.status(403).json({error:'Forbidden'})
        }
    })
}
