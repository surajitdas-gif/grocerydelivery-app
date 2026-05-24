const Report =
require("../models/Report");

// CREATE REPORT
const createReport =
async(req,res)=>{

try{

const {
userId,
userName,
issue
}=req.body;

const newReport =
new Report({

userId,
userName,
issue

});

await newReport.save();

res.json({

success:true,
report:newReport

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

success:false

});

}

};


// GET ALL REPORTS
const getAllReports =
async(req,res)=>{

try{

const reports =
await Report.find()
.sort({
createdAt:-1
});

res.json({

success:true,
reports

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

success:false

});

}

};

module.exports={

createReport,
getAllReports

};