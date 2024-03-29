const User = require('../models/user');



const ErrorHandler= require('../utils/errorhandler');
const catchasyncError = require('../middlewares/catchasyncerror');
const sendToken =require('../utils/jwttoken');
const user = require('../models/user');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// register user =>/api/v1/register 

exports.registerUser = catchasyncError (async(req,res,next)=>{
    const {name, email,password}= req.body;


    const user = await User.create({
        name,email,password,avatar:{
            public_id:'products/dsvbpny402gelwugv2le',
            url:'https://tse1.mm.bing.net/th?id=OIP.1YM53mG10H_U25iPjop83QHaEo&pid=Api&rs=1&c=1&qlt=95&w=185&h=115'
        }
    })

 sendToken(user,200,res)

})

// login user => /api/v1/login
exports.loginUser = catchasyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler('Please enter email & password', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // Log entered email and password for debugging
        console.log('Entered Email:', email);
        console.log('Entered Password:', password);

        const isPasswordMatched = await user.comparePassword(password);

        // Log the result of password comparison for debugging
        console.log('Is Password Matched:', isPasswordMatched);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        sendToken(user,200,res)
     
    } catch (error) {
        next(error);
    }

});
// forgot password => /api/v1/password/forgot CONFIRM
exports.forgotPassword = catchasyncError(async (req, res, next) => {
  
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new ErrorHandler('user not found with this email', 404));
        }

        // get reset token 
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // create reset password url 
        const resetUrl = `${req.protocols}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

        const message = `your password reset token is as follow :\n\n${resetUrl}\n\nIf you have not requested the email then you can ignore it `;
        try {
        await sendEmail({
            email: user.email,
            subject: 'shopit password recovery ',
            message,
        });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
        });
    } catch (error) {
       user.getResetPasswordToken =undefined;
       user.resetPasswordExpire =undefined;

       await user.save ({validateBeforeSave:false});

       return next(new ErrorHandler(error.message,500))
    }
});
exports.resetPassword = catchasyncError(async (req, res, next) => {
    // Hash url token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset has been expired', 400));
    }
    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }
    
   
  // Setup new password 
user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();


    await user.save();
    sendToken(user, 200, res);
});
console.log('SMTP Host:', process.env.SMTP_HOST);
console.log('SMTP Port:', process.env.SMTP_PORT);
console.log('SMTP Username:', process.env.SMTP_EMAIL);




// logout user => /api/v1/logout 
exports.logout = catchasyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'Logged out',
    });
});
//get currently logged in user =>/api/v1/me
exports.getUserProfile = catchasyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
       success:true,
       user
    })
})
//update /change password => /api/v1/logout
exports.updatePassword = catchasyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("password")
    // check previous user password 
    const isMatched =user.comparePassword(req.body.oldpassword)
   if(!isMatched){
    return next(new ErrorHandler('Old password is incorrect ',400))
   }

   user.password= req.body.password;
   await user.save()

   sendToken(user,200,res)

})
//update user profile =>/api/v1/me/update

exports.updateProfile= catchasyncError(async (req,res,next)=>{
  const newUserData ={
    name:req.body.name,
    email:req.body.email
  }
  //update avatar :Todo

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindModify:false

  })
  res.status(200).json({
    sucess:true
  })
})
// admin routes 

//get all users = /api/v1/admin/users

exports.allUsers= catchasyncError(async(req,res,next)=>{
    const users=await User.find();
    

    res.status(200).json({
        sucess:true,
        users
    })
})
//get users details => /api/v1/admin/user/:id

exports.getUserdetails = catchasyncError(async(req,res,next)=>{
    const user =await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with id :${req.params.id} `))
    }

    res.status(200).json({
        sucess:true,
        user
    })
})

//update user profile =>api/v1/admin/user/:id
exports.updateUser= catchasyncError(async (req,res,next)=>{
    const newUserData ={
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
    }
    
  
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
      new:true,
      runValidators:true,
      useFindModify:false
  
    })
    res.status(200).json({
      sucess:true
    })
  })
  //delete user =>/api/v1/admin/user/:id
exports.deleteUser = catchasyncError(async(req,res,next)=>{
    const user =await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with id :${req.params.id} `))
    }

    // remove avatar from cloudinary -TODO
    
    await user.remove();

    res.status(200).json({
        sucess:true,
        user
    })
})
