const mongoose = require('mongoose')

const OtpSchema = mongoose.Schema({
   otp: {
    type: Number,
    required: true
   },
   email: {
      type: String, 
      required: true
   },
   createdAt: { type: Date, default: Date.now }
});

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const Otp = mongoose.model('Otp', OtpSchema);
module.exports = Otp;
