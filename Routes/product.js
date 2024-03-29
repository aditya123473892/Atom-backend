const express=require('express')
const router =express.Router();
const {isAuthenticatedUser,authorizeRoles}= require('../middlewares/auth')

const {getProducts,newProduct,getSingleproduct,updateProduct,deleteProduct}= require('../controllers/productcontroller');

router.route('/products').get( getProducts);

router.route('/products/:id').get(getSingleproduct);


//admin routes
router.route('/admin/products/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);
router.route('/admin/products/:id').put( isAuthenticatedUser,authorizeRoles('admin'),updateProduct).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

module.exports=router