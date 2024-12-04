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
        logout,
        editProfile,
        createAddress,
        changePassword,
        getAddress,
        editAddress,
        deleteAddress,
        changeDefaultAddress
        }  = require('../controller/userController')
const passport = require('passport')
const { getAllUsers } = require('../controller/adminController')
const { googleAuthCallback } = require('../middlewares/googleAuthCallback')
const { isAdmin } = require('../middlewares/auth')
const router = express.Router()

router.get('/',isAdmin,getAllUsers)
router.get('/:userId',getUserData)
router.post('/:email/get-otp',sendOTP)
router.post('/:email/verify-otp',verifyOTP)
router.post('/create',createUser)
router.get('/:email/exist',isEmailExist)
router.get('/:email/verify-exist',verifyEmailExist)
router.post('/login',login)
router.put('/:userId/block',isAdmin,blockUser)
router.put('/:userId/unblock',isAdmin,unBlockUser)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback',googleAuthCallback);
router.get('/verify-token', verifyToken)
router.put('/:userId/edit',editProfile)

router.put('/:email/new-password',setNewPassword)
router.put('/:email/change-pass',changePassword)

router.get('/:userId/address',getAddress)
router.post('/:userId/address/add',createAddress)
router.put('/address/:addressId/edit',editAddress)
router.delete('/address/:addressId/delete',deleteAddress)
router.put('/:userId/address/change-default',changeDefaultAddress)

module.exports=router 