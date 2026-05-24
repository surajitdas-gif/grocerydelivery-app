const Order = require("../models/Order");

const SUPPORT_PHONE =
process.env.SUPPORT_PHONE ||
"+91xxxxxxxxxx";

const SUPPORT_EMAIL =
process.env.SUPPORT_EMAIL ||
"support@email.com";

const chatBot = async (req,res)=>{

try{

const userMessage =
req.body.message || "";

const lowerMsg =
userMessage.toLowerCase();


// HUMAN SUPPORT
if(
lowerMsg.includes("human") ||
lowerMsg.includes("agent") ||
lowerMsg.includes("support")
){

return res.json({

reply:
`You can contact support:

📞 ${SUPPORT_PHONE}
📧 ${SUPPORT_EMAIL}`

});

}


// TRACK ORDER
if(
lowerMsg.includes("track") ||
lowerMsg.includes("order status")
){

const latestOrder =
await Order.findOne()
.sort({
createdAt:-1
});

if(!latestOrder){

return res.json({

reply:
"No active orders found."

});

}

return res.json({

reply:
`Your latest order status is "${latestOrder.status}" 🚚`

});

}


// CHANGE ADDRESS
if(
lowerMsg.includes("change address") ||
lowerMsg.includes("delivery address")
){

return res.json({

reply:
"Delivery address can be changed before order confirmation."

});

}


// GEMINI CHECK
console.log(

"GEMINI:",

process.env.GEMINI_API_KEY
? "FOUND"
: "NOT FOUND"

);


// GEMINI REQUEST
const response =
await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

contents:[

{

parts:[

{

text:
`You are an AI assistant for a food delivery app.

Reply briefly and politely.

User:
${userMessage}`

}

]

}

]

})

}

);


// GEMINI RESPONSE
const data =
await response.json();

console.log(

"GEMINI RESPONSE:",

JSON.stringify(
data,
null,
2
)

);


// GET REPLY
const reply =

data?.candidates?.[0]
?.content?.parts?.[0]
?.text ||

data?.promptFeedback
?.blockReason ||

"Pepper couldn't answer right now 🌿 Please ask again in a moment.";


// SEND RESPONSE
return res.json({

reply

});

}

catch(error){

console.log(

"CHAT ERROR:",

error

);

return res
.status(500)
.json({

reply:
error.message ||
"Server error"

});

}

};

module.exports = {

chatBot

};