const Product = require("../models/Product");

// ADD PRODUCT
const addProduct = async (req,res)=>{

try{

const product =
new Product(
req.body
);

await product.save();

res.json({

message:
"Product added",

product

});

}

catch(error){

res.status(500)
.json({
message:error.message
});

}

};


// SEARCH PRODUCT
const searchProduct =
async(req,res)=>{

try{

const products =
await Product.find({

name:{

$regex:
req.params.keyword,

$options:"i"

}

});

res.json(
products
);

}

catch(error){

res.status(500)
.json({
message:error.message
});

}

};


// ALL PRODUCTS
const getAllProducts =
async(req,res)=>{

try{

const products =
await Product.find();

res.json(
products
);

}

catch(error){

res.status(500)
.json({
message:error.message
});

}

};


// DELETE PRODUCT
const deleteProduct =
async(req,res)=>{

try{

await Product.findByIdAndDelete(
req.params.id
);

res.json({

message:
"Deleted successfully"

});

}

catch(error){

res.status(500)
.json({
message:error.message
});

}

};


// UPDATE PRODUCT
const updateProduct =
async(req,res)=>{

try{

const updated =
await Product.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true
}

);

res.json(
updated
);

}

catch(error){

res.status(500)
.json({
message:error.message
});

}

};

module.exports={

addProduct,
searchProduct,
getAllProducts,
deleteProduct,
updateProduct

};