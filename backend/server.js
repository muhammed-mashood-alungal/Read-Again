const express = require('express')
const app = express()
const dotenv=require('dotenv')
const {connectDB} = require('./config/db')
const userRoutes = require('./Routes/userRoutes')
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');

app.use(express.urlencoded({extended : true}))
app.use(express.json())
dotenv.config()
connectDB()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(passport.initialize());
app.use(session({
    secret: 'your_secret_key',  
    resave: true,
    saveUninitialized: true
}));
app.use(passport.session());
require('./utils/passport.js');
//Routes
app.use('/api/users',userRoutes)
app.use((err,req,res)=>{
    console.log(err)
    console.log("hello")  
})  
app.listen(process.env.PORT,()=>{
    console.log("Server Started Succefully")
})