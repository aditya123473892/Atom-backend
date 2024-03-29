const Product = require("../models/products");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerror = require("../middlewares/catchasyncerror");
const APIFeatures = require("../utils/apifeatures");

// Create new product => /api/v1/product/new
exports.newProduct = catchasyncerror(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  {
    res.status(201).json({
      success: true,
      product,
    });
  }
});

//Get all products  => /api/v1/products

exports.getProducts = catchasyncerror(async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)

    .search()
    .filter()
    .pagination(resPerPage);

  const product = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: product.length,
    product,
    productsCount,
  });
});

//get single product detail  => /api/v1/product/:id
exports.getSingleproduct = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
//UPDATE PRODUCTS =>/api/v1/product/:id

exports.updateProduct = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    sucess: true,
    product,
  });
});
//delete products =>/api/v1/admin/product/:id

exports.deleteProduct = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      sucess: false,
      message: "product not found",
    });
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});
