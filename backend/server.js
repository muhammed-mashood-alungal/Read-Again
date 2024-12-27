const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const { connectDB } = require('./config/db')
const userRoutes = require('./Routes/userRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const bookRoutes = require('./Routes/booksRoutes')
const categoryRoutes = require('./Routes/categoryRoutes')
const authRoutes = require('./Routes/authRoutes')
const cartRoutes = require('./Routes/cartRoutes')
const orderRoutes = require('./Routes/orderRoutes')
const couponRoutes = require('./Routes/couponsRoutes')
const wishlistRoutes = require('./Routes/wishlistRoutes')
const offerRoutes = require('./Routes/offerRoutes')
const razorpayRoutes = require('./Routes/razorpayRoutes')
const cors = require('cors')
const path = require("path")
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public/images', express.static(path.join(__dirname, 'public/images')))
connectDB()

app.use(cors({
    origin: ['http://localhost:3000', 'https://www.mashood.site'],
    credentials: true
}))
app.use(passport.initialize());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.session());
require('./utils/passport.js');

//ROUTES
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/razorpay', razorpayRoutes)


//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    if (err) {
        console.log(err)
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server Started Succefully")
}) 