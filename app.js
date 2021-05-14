require('dotenv/config') //envfile

const express = require('express')
const app = express()
const mongoose = require('mongoose')
var cors = require('cors')
const path = require('path')

app.use(cors()) 
// Routes
const item = require('./routes/api/item')


const uri = process.env.MONGO_URL
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Connected to DB!")
    })
    .catch((error) => {
        console.log("Error IN dataBase")
    })
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/item/api',item)

// **********BUILD********
// IF we are in production
if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const port = process.env.PORT || 3000
app.listen(port,(req,res)=>{
    console.log("Connected to port 3000")
})
