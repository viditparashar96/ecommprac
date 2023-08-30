const mongoose=require('mongoose');


var productSchema=mongoose.Schema({
  productname:String,
  productprice:String,
  productquantity:String,
  sellerName:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  


})

module.exports=mongoose.model("product",productSchema)