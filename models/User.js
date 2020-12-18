const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    attendance:{
        type:Array,
        default:Array(10).fill(1)
    }
});

const User = mongoose.model('User',UserSchema);
module.exports = User;
