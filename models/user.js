const mongoose = require('mongoose')
const passportMongoose = require('passport-local-mongoose')

userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }]
})

userSchema.plugin(passportMongoose)


const User = mongoose.model('User', userSchema)

module.exports = User