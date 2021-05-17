const express = require('express')
const { models } = require('mongoose')

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.json({message:"Please login to continue!",success:false})
    }
    next()
}

module.exports = isLoggedIn