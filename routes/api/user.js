const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const passport = require('passport')
const auth = require('../../middleware/auth')

const User = require('../../models/user')
const { use } = require('./item')

router.post('/user/register',async(req,res)=>{
    const {email,name,password} = req.body
    console.log(req.body)
    try {
         const user = new User({
        username:name,
        email:email
        })
        const newUser = await User.register(user, password)
        req.login(newUser, async (err) => {
            if (!err) {
                const userId = newUser._id
                const userName = newUser.username
                const token =await jwt.sign({userId},process.env.JWT_SECRET,{
                    expiresIn:'1440m'
                })
                res.json({success:true,message:"User Registered succesfully",userName,token})
            }
            else {
                return next(err)
            }
        })
    } catch (error) {
        res.json({success:false,message:error.message})
    }
})

router.get('/user/login',(req,res)=>{
    res.json({message:"Please check login details",success:false})
})

router.post('/user/login', passport.authenticate('local',{failureRedirect:'/item/api/user/login'}),async (req, res) => {
    const userId = req.user._id
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'1440m'
    })
    const {iat,exp} = await jwt.decode(token)
    res.json({message:"Logged in Succesfully",token,success:true})
})

router.get('/user/logout',(req,res)=>{
    req.logOut()
    res.json({message:"Logged Out Succesfully",success:true})
})

router.get('/user',auth,async (req,res)=>{
    const user = await User.findById(req.user.userId)
    res.json(user).status(200)
})

module.exports = router