const ErrorHandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwt = require('jsonwebtoken')
const User = require('../models/user')
// checks if users authenticated or not
exports.isAuthenticatedUser = catchasyncerror(async(req,res,next)=>{
    const {token}= req.cookies

if(!token){
    return next(new ErrorHandler('login first to acess',402))
}

const decoded = jwt.verify(token, process.env.JWT_SECRET)

req.user = await User.findById(decoded.id);

next()
})
// handling users roles
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next (
            new ErrorHandler(`Role (${req.user.role})  is not allowed to acess this resource `,403))
        }
        next()
    }
}