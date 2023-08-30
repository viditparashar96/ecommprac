const mongoose=require('mongoose');
var plm=require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/e-comm-prac");

var userSchema=mongoose.Schema({
  username: { type: String},
  password: { type: String},
  name: { type: String },
  role:{
    type:String,
    default:"user"
  },
  shippingAddress: { type: String },
  billingAddress: { type: String },
  contactInformation: {
    email: { type: String },
    phoneNumber: { type: String }
  },
  dateOfBirth: { type: Date },
  profilePicture: { type: String },
  paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  shoppingCart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]

})
userSchema.plugin(plm)
module.exports=mongoose.model("users",userSchema)