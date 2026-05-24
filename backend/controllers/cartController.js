const Cart = require("../models/Cart");

// GET USER CART
const getCart = async (req,res)=>{

try{

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
userId,
items
}=req.body;

let cart =
await Cart.findOne({
userId
});

if(cart){

cart.items =
items;

await cart.save();

}

else{

cart =
new Cart({

userId,
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