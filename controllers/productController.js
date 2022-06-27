const Joi = require("joi");
const db = require("../models/index");

// models
const Product = db.products;
const Rating = db.ratings;
const Comment = db.comments;

/**
 * @name addProduct
 * @type POST Request
 * @access Public
 * @description Add Product
 */
const addProduct = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    currency: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    published: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      err: error.details[0].message,
    });

  try {
    let productInfo = {
      name: req.body.name,
      currency: req.body.currency,
      price: req.body.price,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
    };

    const product = await Product.create(productInfo);

    return res.status(200).json({
      status: 200,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to add product",
    });
  }
};

/**
 * @name fetchProducts
 * @type GET Request
 * @access Public
 * @description Get all Products
 */
const fetchProducts = async (req, res) => {
  try {
    let products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (!products) {
      return res.status(400).json({
        status: 400,
        message: "No product available",
      });
    }

    return res.status(200).json({
      status: 200,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

/**
 * @name fetchProductsByName
 * @type GET Request
 * @access Public
 * @description Get Products with same name
 */
const fetchProductsByName = async (req, res) => {
  const { productName } = req.params;

  try {
    let product = await Product.findAll({
      where: { name: productName },
      order: [["name", "ASC"]],
    });
    if (!product) {
      return res.status(400).json({
        status: 400,
        message: "Product Unavailable",
      });
    }

    return res.status(200).json({
      status: 200,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

/**
 * @name fetchProductById
 * @type GET Request
 * @access Public
 * @description Get a single Product
 */
const fetchProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    let product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(400).json({
        status: 400,
        message: "Products not found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

/**
 * @name updateProduct
 * @type PUT Request
 * @access Public
 * @description Update info about a single Product
 */
const updateProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    let updateProduct = await Product.update(req.body, {
      where: { id: productId },
    });
    if (!updateProduct) {
      return res.status(400).json({
        status: 400,
        message: "Failed to update product",
      });
    }

    return res.status(200).json({
      status: 200,
      data: `Product of id: ${productId} is updated!`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

/**
 * @name deleteProduct
 * @type DELTETE Request
 * @access Public
 * @description Delete a single Product
 */
const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.destroy({ where: { id: productId } });
    if (!product) {
      return res.status(400).json({
        status: 400,
        message: "Failed to delete product",
      });
    }

    return res.status(200).json({
      status: 200,
      data: `Product of id: ${productId} is deleted!`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

// connect one to many relation between product, ratings and comments
/**
 * @name fetchProductRatings
 * @type GET Request
 * @access Public
 * @description Get Ratings for a product
 */
const fetchProductRatings = async (req, res) => {
  const { productId } = req.params;

  try {
    let rating = await Rating.findOne({ where: { product_id: productId } });
    if (!rating) {
      return res.status(400).json({
        status: 400,
        message: "No rating for product found",
      });
    }

    let productRatings = await Product.findOne({
      include: [
        {
          model: Rating,
          as: "rating",
        },
      ],
      where: { id: productId },
    });

    return res.status(200).json({
      status: 200,
      data: productRatings?.rating,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

/**
 * @name fetchProductComments
 * @type GET Request
 * @access Public
 * @description Get Comments for a product
 */
const fetchProductComments = async (req, res) => {
  const { productId } = req.params;

  try {
    let comment = await Comment.findOne({ where: { product_id: productId } });
    if (!comment) {
      return res.status(400).json({
        status: 400,
        message: "No comment found for this product",
      });
    }

    let productComments = await Product.findOne({
      include: [
        {
          model: Comment,
          as: "comment",
        },
      ],
      where: { id: productId },
    });

    return res.status(200).json({
      status: 200,
      data: productComments?.comment,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  fetchProducts,
  fetchProductById,
  fetchProductsByName,
  updateProduct,
  deleteProduct,
  fetchProductRatings,
  fetchProductComments,
};
