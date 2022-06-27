const Joi = require("joi");
const db = require("../models/index");

// models
const Comment = db.comments;
const Product = db.products;

/**
 * @name addComment
 * @type POST Request
 * @access Public
 * @description Add Comment
 */
const addComment = async (req, res) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
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

    let comment = {
      comment: req.body.comment,
      product_id: req.body.product_id,
    };

    const productComment = await Comment.create(comment);

    return res.status(200).json({
      status: 200,
      data: productComment,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to add comment for product",
    });
  }
};

module.exports = {
  addComment,
};
