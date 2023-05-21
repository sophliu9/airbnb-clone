const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const User = require('./models/User.js'); // Manually importing our user model
const { json } = require('express');
const jwt = require('jsonwebtoken'); // Import json web token
require('dotenv').config()

const bcryptSalt = bcrypt.genSaltSync(10); // Specifies this is an async function
const jwtSec = 'fasefraw374673sjhdsjdhwfasfr'

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

// console.log(process.env.MONGO_URL) 
mongoose.connect(process.env.MONGO_URL);
// o0b610rqh6GCCM1T

app.get('/test', (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req,res)=> { // Creare register endpoint
    const {name,email,password} = req.body; // Grabbing name, email, password from request body
    // Create our User model
    try {
        const userDoc = await User.create({ // async function, we await the creation of a user
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt), // Must encrypt password
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req,res) => { // Create login endpoint
    const {email,password} = req.body;
    // Want to find a user with this email
    const userDoc = await User.findOne({email}); // See if email entered is valid
    if (userDoc) { // Check to make sure userDoc is not null 
        const passOk = bcrypt.compareSync(password, userDoc.password); // Check password
        if (passOk) {
            jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSec, {}, (err,token) => {
                if (err) throw err;
                res.cookie('token', token).json('Pass ok');
            }); // Create JSON web token
        } else {
            res.status(422).json('Pass not ok');
        }
    } else {
        res.json('Not found');
    }
});
app.listen(4000);