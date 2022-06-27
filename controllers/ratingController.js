const Joi = require("joi");
const db = require("../models/index");

// models
const Rating = db.ratings;
const Product = db.products;

/**
 * @name addRating
 * @type POST Request
 * @access Public
 * @description Add Rating
 */
const addRating = async (req, res) => {
  const schema = Joi.object({
    rating: Joi.number().max(5).required(),
    product_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      err: error.details[0].message,
    });

  try {
    let product = await Product.findOne({ where: { id: req.body.product_id } });
    if (!product) {
      return res.status(400).json({
        status: 400,
        message: "ProductId not valid",
      });
    }

    let rating = {
      rating: req.body.rating,
      product_id: req.body.product_id,
    };

    const productRating = await Rating.create(rating);

    return res.status(200).json({
      status: 200,
      data: productRating,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to add rating for product",
    });
  }
};

module.exports = {
  addRating,
};
