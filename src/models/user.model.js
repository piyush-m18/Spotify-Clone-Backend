const monngoose=require("mongoose");

const userSchema= new monngoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","artist"],
        default:"user"
    }
})

const userModel=monngoose.model("User",userSchema);

module.exports=userModel;