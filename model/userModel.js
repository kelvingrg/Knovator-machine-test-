const mongoose= require('mongoose')

const userSchema=mongoose.Schema(
    {
        email:String,
        password:String
    }

)
const user=mongoose.model("user",userSchema)
module.exports= user