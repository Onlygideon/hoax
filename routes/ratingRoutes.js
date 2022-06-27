const express = require("express");

const ratingController = require("../controllers/ratingController.js");

const router = express.Router();

router.post("/add-rating", ratingController.addRating);



module.exports = router;