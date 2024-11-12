const mongoose = require('mongoose')

const UsersSChema=mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Enter a username"]
    },
    email:{
        type:String,
        required:[true,"Please Enter a Email "],
        unique:[true,"User with this Email address already exists!"]
    },
    phone:{
        type:Number,
    }, 
    googleId:{
      type:String
    },
    role:{
        type:String,
        required:[true,"Please define user Role"]
    },
    memberShipType:{
        type:String,
        default:"Basic"
    },
    profileData:{
      bio:{
        type:String
      },
      addresses:{
        type:[mongoose.Schema.Types.ObjectId]
      },
      genres:{
        type:[mongoose.Schema.Types.ObjectId]
      },
      publishedBooks:{
        type:[mongoose.Schema.Types.ObjectId]
      }
    },
    password:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const User = mongoose.model('User',UsersSChema)
module.exports=User