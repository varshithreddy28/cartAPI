const express = require('express')
const mongoose = require('mongoose')
const Item = require('../../models/item')

const router = express.Router()

router.get('/',async (req,res,next)=>{
    try {
        let items = await Item.find().sort({date:-1})//Sorting with date
        res.json(items).sendStatus(200)
    } catch (error) {
        next(error)
        // res.json({msg:`${error.message}`}).sendStatus(404)
    }
})

router.post('/new',async (req,res)=>{
    const {name} = req.body
    try {
        const newItem = new Item({name})
        await newItem.save()
        res.json(newItem).sendStatus(200)
    } catch (error) {
        res.sendStatus(404).json({msg:`${error.message}`})
    }
})

router.delete('/delete/:id',async (req,res)=>{
    const {id} = req.params
    try {
        await Item.findByIdAndDelete(id)
        res.json({success:true})
    } catch (error) {
        res.json({success:false})
    } 
})


module.exports = router