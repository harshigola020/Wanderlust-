const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review= require("./review.js");
// const User=require("./user.js");

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image: {
        filename: String,
        url: {
                type:String,
                default:"https://media.istockphoto.com/id/162669589/photo/loungers-desserted-beach-blue-sky.webp?a=1&b=1&s=612x612&w=0&k=20&c=MkcRlbHg07tvm8aiOeCDbTk72UBK3DlU5nObOeWD4y4=",
                set: (v)=> v===""? "https://media.istockphoto.com/id/162669589/photo/loungers-desserted-beach-blue-sky.webp?a=1&b=1&s=612x612&w=0&k=20&c=MkcRlbHg07tvm8aiOeCDbTk72UBK3DlU5nObOeWD4y4=":v,
            }
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:Review,
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing=mongoose.model("Listing", listingSchema);

module.exports=Listing;
