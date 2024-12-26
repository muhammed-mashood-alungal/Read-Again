const express = require('express')
const { createOffer,
    getAllOffers,
    getOfferDetails,
    updateOffer,
    handleOfferActivation } = require('../controller/offerController')
const router = express.Router()
const { isAdmin } = require('../middlewares/auth')


router.get('/', getAllOffers)
router.post('/', isAdmin, createOffer)
router.get('/:offerId', getOfferDetails)
router.put('/:offerId', isAdmin, updateOffer)
router.patch('/:offerId/handle-activation', isAdmin, handleOfferActivation)

module.exports = router