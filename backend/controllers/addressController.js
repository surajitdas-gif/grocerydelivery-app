const Address =
require("../models/Address");

const getUserAddress =
async (req,res) => {

try{

if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
  return res.status(403).json({ message: "Not authorized" });
}

const address =
await Address.findOne({

userId:
req.params.userId,

isDefault:true

});

if(!address){

return res.json(null);

}

res.json(address);

}

catch(error){

res.status(500).json({
error:error.message
});

}

};

const saveAddress =
async (req,res)=>{

try{

const {
name,
phone,
altPhone,
address,
lat,
lng
}=req.body;

const finalUserId = req.body.userId || req.user._id.toString();

if (req.user.role !== "admin" && req.user._id.toString() !== finalUserId.toString()) {
  return res.status(403).json({ message: "Not authorized" });
}

await Address.updateMany(
{userId: finalUserId},
{
isDefault:false
}
);

const newAddress =
new Address({

userId: finalUserId,
name,
phone,
altPhone,
address,
lat,
lng,

isDefault:true

});

await newAddress.save();

res.json({

success:true,
address:newAddress

});

}

catch(error){

res.status(500).json({
error:error.message
});

}

};

module.exports = {
getUserAddress,
saveAddress
};