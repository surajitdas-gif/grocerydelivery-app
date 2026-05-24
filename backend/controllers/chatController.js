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

if(
lowerMsg.includes("change address") ||
lowerMsg.includes("delivery address")
){

return res.json({

reply:
"Delivery address can be changed before order confirmation."

});

}

console.log(
"GEMINI:",
process.env.GEMINI_API_KEY
? "FOUND"
: "NOT FOUND"
);

const response =
await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

User: ${userMessage}`
}
]
}
]

})

}
);
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

const reply =
data?.candidates?.[0]
?.content?.parts?.[0]
?.text ||

data?.promptFeedback?.blockReason ||

"No response generated";
return res.json({

reply:
reply ||
"No response generated"

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