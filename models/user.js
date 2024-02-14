const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose")


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },

    //username,password are automatically defined by passport-local-mongoose with additional hashing and salting

});
userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);
module.exports=User;