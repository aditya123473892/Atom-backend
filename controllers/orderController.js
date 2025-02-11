const Order = require('../models/order');
const Product = require('../models/products'); // Assuming you have a 'product' model
const user = require('../models/user');


const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middlewares/catchasyncerror');

// Create a new order => api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        order
    });
});


// Get single order => api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler('No order found with this id', 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});
// Get user's orders => api/v1/orders/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    });
});


// Get all orders => api/v1/admin/orders
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update/process orders / admin => api/v1/admin/orders/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('This order has already been delivered', 400));
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
       
    });
});
// delte order 
exports.DeleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('No order found with this id', 404));
    }
    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
      
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock  =product.stock- quantity;
    await product.save({validateBeforeSave:false});
}
