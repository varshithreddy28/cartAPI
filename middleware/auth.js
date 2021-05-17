const express = require('express')
const jwt  = require('jsonwebtoken')

// Middle ware for checking a valid token and assingning result to req.user(the method we did on own)
const auth = async(req,res,next)=>{
    const bearer = req.headers['authorization']
    const token = bearer.split(' ')[1] // Taking token from header
    console.log(token)
    // If no token
    if(!token)
        return res.send(401).json("No Authorization")
    // Checking valid token
        // If valid returns the userId
    try {
        const data = await jwt.verify(token,process.env.JWT_SECRET)
            req.user = data
            console.log(data)
            next()
    } catch (error) {
        res.status(400).json({msg:`${error.message}`,success:false})
    }
    
}

module.exports = auth