const express = require('express');
const router = express.Router(); // Use 'Router' instead of 'router'
const userSchema = require('../models/user'); 
const { newOrder, getSingleOrder, myOrders, allOrders, updateOrder, DeleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post( isAuthenticatedUser,newOrder); // Corrected the route path

router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);


router.route('/admin/orders/').get(isAuthenticatedUser, authorizeRoles('user'),allOrders);


router.route('/admin/order/:id')
.put(isAuthenticatedUser, authorizeRoles('user'),updateOrder)
.delete(isAuthenticatedUser, authorizeRoles('user'),DeleteOrder);


module.exports = router;
