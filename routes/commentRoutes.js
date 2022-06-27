const express = require("express");

const commentController = require("../controllers/commentController.js");

const router = express.Router();

router.post("/add-comment", commentController.addComment);



module.exports = router;