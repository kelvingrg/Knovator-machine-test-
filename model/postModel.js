const mongoose= require('mongoose')

const postSchema=mongoose.Schema(
    {
        title:{required:true, type:String},
        body:{required:true, type:String},
         createdBy:{required:true, type:String},
         active:{required:true, type:Boolean},
         location:{
        type: { type: String,
            default: "Point"
                    },
        coordinates: []
         }

       
    })
 


postSchema.index({ location: "2dSphere"})

module.exports = mongoose.model("posts",postSchema);