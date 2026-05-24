const express =
require("express");

const router =
express.Router();

const {

createReport,
getAllReports

}
=
require(
"../controllers/reportController"
);

router.post(
"/create",
createReport
);

router.get(
"/all",
getAllReports
);

module.exports =
router;