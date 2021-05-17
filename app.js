require('dotenv/config') //envfile

const express = require('express')
const app = express()
const mongoose = require('mongoose')
var cors = require('cors')
const User = require('./models/user')
const path = require('path')
const passport = require('passport')
const passportLocal = require('passport-local')
const cookieParser = require('cookie-parser')
app.use(cookieParser(process.env.EXPRESS_SECRET))
// SESSION
const session = require('express-session')
app.use(session({
    secret: process.env.EXPRESS_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,  // setting cookie expiery date for 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));


app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

// passport for session:
// 
passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });


app.use(cors({origin: true, credentials: true})) 

// Routes
const item = require('./routes/api/item')
const user = require('./routes/api/user')


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
app.use('/item/api',user)


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
