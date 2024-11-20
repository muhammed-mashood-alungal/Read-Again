const express= require('express')
const { sendOTP,
        verifyOTP,
        createUser,
        isEmailExist,
        login, 
        setNewPassword,
        verifyEmailExist,
        getUserData,
        deleteUser, 
        recoverUser,
        blockUser, 
        unBlockUser,
        verifyToken, 
        logout
        }  = require('../controller/userController')
const passport = require('passport')
const { getAllUsers } = require('../controller/adminController')
const { isAdmin, protect ,isLoggedIn} = require('../middlewares/auth')
<<<<<<< HEAD
=======
const { googleAuthCallback } = require('../middlewares/googleAuthCallback')
>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958
const router = express.Router()

router.get('/',isAdmin,getAllUsers)
router.get('/:userId',getUserData)
router.post('/:email/get-otp',sendOTP)
router.post('/:email/verify-otp',verifyOTP)
router.post('/create',createUser)
router.get('/:email/exist',isEmailExist)
router.get('/:email/verify-exist',verifyEmailExist)
router.post('/login',login)
router.put('/:email/new-password',setNewPassword)
router.put('/:userId/block',isAdmin,blockUser)
router.put('/:userId/unblock',isAdmin,unBlockUser)
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
<<<<<<< HEAD
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000/');
    }
);
=======
router.get('/auth/google/callback',googleAuthCallback);
router.get('/verify-token', verifyToken);

>>>>>>> dc5bdfea52910490befd6242471e3f6164bc8958

module.exports=router 