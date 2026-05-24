const User = require("../models/User");
const Otp = require("../models/Otp");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
const signup = async (req,res)=>{

try{

const {
name,
email,
phone,
password,
role
}=req.body;

if(
(!email && !phone)
||
!password
||
!name
){

return res.status(400)
.json({
message:
"Missing required fields"
});

}

const existingUser =
await User.findOne({

$or:[
...(email?[{email}]:[]),
...(phone?[{phone}]:[])
]

});

if(existingUser){

return res.status(400)
.json({
message:
"User already exists"
});

}

const hashedPassword =
await bcrypt.hash(
password,
10
);

const newUser =
new User({

name,

email:
email || null,

phone:
phone || null,

password:
hashedPassword,

role:
role || "user"

});

await newUser.save();

res.status(201)
.json({

success:true,
message:
"User created successfully"

});

}

catch(error){

res.status(500)
.json({

success:false,
message:error.message

});

}

};


// LOGIN
const login =
async(req,res)=>{

try{

const {
email,
phone,
password
}=req.body;

const user =
await User.findOne(

email
?
{email}
:
{phone}

);

if(!user){

return res.status(400)
.json({

success:false,
message:
"User not found"

});

}

const isMatch =
await bcrypt.compare(
password,
user.password
);

if(!isMatch){

return res.status(400)
.json({

message:
"Invalid password"

});

}

const token =
jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

res.json({

success:true,
message:
"Login successful",
token,
user

});

}

catch(error){

res.status(500)
.json({

success:false,
message:error.message

});

}

};


// UPDATE PROFILE
const updateProfile =
async(req,res)=>{

try{

const {
name,
phone,
address
}=req.body;

const updatedUser =
await User.findByIdAndUpdate(

req.params.id,

{
name,
phone,
address
},

{
new:true
}

);

res.json(
updatedUser
);

}

catch(error){

res.status(500)
.json({

message:error.message

});

}

};


// LOGOUT
const logout =
(req,res)=>{

res.json({

success:true,
message:
"Logout successful"

});

};


// SEND OTP
const sendOtp =
async(req,res)=>{

try{

const {phone}
=
req.body;

if(!phone){

return res.status(400)
.json({

success:false,
message:
"Phone number required"

});

}

const otp =
process.env.DEMO_MODE==="true"
?
process.env.DEMO_OTP
:
Math.floor(
100000+
Math.random()*900000
).toString();

await Otp.deleteMany({
phone
});

await Otp.create({

phone,
otp,

expiresAt:
new Date(
Date.now()+
5*60*1000
)

});

res.json({

success:true,
message:
"OTP sent"

});

}

catch(error){

res.status(500)
.json({

success:false,
message:error.message

});

}

};


// LOGIN WITH OTP
const loginWithOtp =
async(req,res)=>{

try{

const {
phone,
otp,
role
}=req.body;

const otpData =
await Otp.findOne({
phone
});

if(!otpData){

return res.status(400)
.json({

success:false,
message:
"OTP not found"

});

}

if(
Date.now()
>
otpData.expiresAt
){

return res.status(400)
.json({

success:false,
message:
"OTP expired"

});

}

const user =
await User.findOne({

phone,

...(role
?
{role}
:{})
});

if(!user){

return res.status(404)
.json({

success:false,
message:
"User not found"

});

}

const token =
jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

await Otp.deleteMany({
phone
});

res.json({

success:true,
message:
"Login successful",
token,
user

});

}

catch(error){

res.status(500)
.json({

success:false,
message:error.message

});

}

};

module.exports = {

signup,
login,
updateProfile,
logout,
sendOtp,
loginWithOtp

};