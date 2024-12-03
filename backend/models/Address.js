const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  phoneNumbers: [{
    type: String,
    required: true
  }],
  city: {
    type: String,
    required: true
  },
  landmark:{
     type:String,
     required:true
  },
  district:{
    type:String,
    required:true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;
