const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema

//Indivisual products like multiple similiar shoes
const ProductCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product",

    },
    name:{type:String},
    count:{type:Number},
    price:{type:Number}
})

//Creating Order Schema
//Collection of products
const OrderSchema = new mongoose.Schema({
    products:[ProductCartSchema],
    transaction_id:{
    
    },
    amount:{
        type:Number
    },
    address:{
        type:String,
    },
    status:{
        type:String,
        default:"Recieved",
        enum:["Cancelled","Delivered","Shipped","Processing","Recieved"]
    },
    updated:{
        type:Date
    },
    user:{
        type:ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema)
const Order = mongoose.model("Order",OrderSchema)

module.exports = {ProductCart,Order}