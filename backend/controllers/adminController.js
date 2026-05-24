const Order =
require("../models/Order");

const User =
require("../models/User");

// GET ALL ORDERS
const getAllOrders =
async (req,res)=>{

try{

const orders =
await Order.find()
.sort({
createdAt:-1
});

res.json(
orders
);

}

catch(error){

res.status(500)
.json({
error:error.message
});

}

};

// UPDATE ORDER STATUS
const updateOrderStatus =
async(req,res)=>{

try{

const {status}
=
req.body;

const updatedOrder =
await Order.findByIdAndUpdate(

req.params.id,

{
status
},

{
new:true
}

);

res.json({

success:true,
order:updatedOrder

});

}

catch(error){

res.status(500)
.json({
error:error.message
});

}

};

// GET USERS
const getAllUsers =
async(req,res)=>{

try{

const users =
await User.find()
.sort({
createdAt:-1
});

res.json(
users
);

}

catch(error){

res.status(500)
.json({
error:error.message
});

}

};

module.exports={

getAllOrders,
updateOrderStatus,
getAllUsers

};