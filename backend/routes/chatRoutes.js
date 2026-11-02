const express =
require("express");

const router =
express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
chatBot
} = require(
"../controllers/chatController"
);

router.post(
"/",
protect,
chatBot
);

module.exports =
router;