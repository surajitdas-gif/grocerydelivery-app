const cloudinary =
require("../config/cloudinary");

const uploadImage =
async(req,res)=>{

try{

const result =
await cloudinary
.uploader.upload(

req.file.path,

{
folder:
"grocery-app"
}

);

res.json({

success:true,

imageUrl:
result.secure_url

});

}

catch(error){

if(
process.env.NODE_ENV
!== "production"
){

console.log(error);

}

res.status(500)
.json({

success:false,
message:
"Upload failed"

});

}

};

module.exports = {
uploadImage
};