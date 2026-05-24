const Address =
require("../models/Address");

const getUserAddress =
async (req,res) => {

try{

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

userId,
name,
phone,
altPhone,
address,
lat,
lng

}=req.body;

await Address.updateMany(
{userId},
{
isDefault:false
}
);

const newAddress =
new Address({

userId,
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