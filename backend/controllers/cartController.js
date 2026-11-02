const Cart = require("../models/Cart");

// GET USER CART
const getCart = async (req,res)=>{

try{

if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
  return res.status(403).json({ message: "Not authorized" });
}

const cart =
await Cart.findOne({
userId:req.params.userId
});

if(!cart){

return res.json({
items:[]
});

}

res.json(cart);

}

catch(error){

res.status(500)
.json({
error:error.message
});

}

};


// SAVE USER CART
const saveCart =
async(req,res)=>{

try{

const {
items
}=req.body;

const finalUserId = req.body.userId || req.user._id.toString();

if (req.user.role !== "admin" && req.user._id.toString() !== finalUserId.toString()) {
  return res.status(403).json({ message: "Not authorized" });
}

let cart =
await Cart.findOne({
userId: finalUserId
});

if(cart){

cart.items =
items;

await cart.save();

}

else{

cart =
new Cart({

userId: finalUserId,
items

});

await cart.save();

}

res.json({

success:true

});

}

catch(error){

res.status(500)
.json({
error:error.message
});

}

};


// CLEAR CART
const clearCart =
async(req,res)=>{

try{

if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
  return res.status(403).json({ message: "Not authorized" });
}

await Cart.findOneAndDelete({

userId:
req.params.userId

});

res.json({

success:true

});

}

catch(error){

res.status(500)
.json({
error:error.message
});

}

};

module.exports={

getCart,
saveCart,
clearCart

};