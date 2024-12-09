const express = require('express')
const { createOffer, getAllOffers, getOfferDetails, updateOffer, handleOfferActivation } = require('../controller/offerController')
const router = express.Router()

router.get('/',getAllOffers)
router.post('/',createOffer)
router.get('/:offerId',getOfferDetails)
router.put('/:offerId',updateOffer)
router.patch('/:offerId/handle-activation',handleOfferActivation)

module.exports = router