const Product = require("../models/Product");

// In-Memory cache for high-concurrency (1000+ users)
let cachedProducts = null;
let cacheExpiry = 0;

const clearProductCache = () => {
  cachedProducts = null;
  cacheExpiry = 0;
};

// ADD PRODUCT
const addProduct = async (req,res)=>{

try{

const product =
new Product(
req.body
);

await product.save();
clearProductCache();

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


// ALL PRODUCTS (Cached in-memory with 15s TTL for 1000+ users)
const getAllProducts = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedProducts && now < cacheExpiry) {
      return res.json(cachedProducts);
    }

    const products = await Product.find().lean();
    cachedProducts = products;
    cacheExpiry = now + 15000; // 15 seconds cache

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    clearProductCache();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    clearProductCache();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={

addProduct,
searchProduct,
getAllProducts,
deleteProduct,
updateProduct

};