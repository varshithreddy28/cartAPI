const express = require('express')
const mongoose = require('mongoose')
const Item = require('../../models/item')
const User = require('../../models/user')
const auth = require('../../middleware/auth')

// Middlewares
const isLoggedIn = require('../../middleware/loggedin')

const router = express.Router()

router.get('/',auth,async (req,res)=>{
    try {
        const id = req.user.userId
        const foundUser = await User.findById(id).populate('items')
        const foundItems = foundUser.items
        // let items = await Item.find().sort({date:-1})//Sorting with date
        res.json(foundItems).sendStatus(200)
    } catch (error) {
        res.json({msg:`${error.message}`}).sendStatus(404)
    }
})

// Private route
router.post('/new',auth,async (req,res)=>{
    const {name} = req.body
    const id = req.user.userId
    const foundUser = await User.findById(id)
    try {
        const newItem = new Item({name})
        foundUser.items.push(newItem)
        await newItem.save()
        await foundUser.save()
        res.json(newItem).sendStatus(200)
    } catch (error) {
        res.sendStatus(404).json({message:`${error.message}`})
    }
})

// Private route
router.delete('/delete/:id',auth,async (req,res)=>{
    const {id} = req.params
    const uid = req.user.userId
    let isOwner = false
    const foundUser = await User.findById(uid)
    const items = foundUser.items
    items.forEach((item) => {
        if(item==id)
            return isOwner=true
    });
    if(isOwner){
        try {
            await Item.findByIdAndDelete(id)
            res.json({success:true})
        } catch (error) {
            res.json({success:false})
        } 
    }
    else{
        res.json({message:"You are Not the Owner of the item",success:false})
    }
})


module.exports = router