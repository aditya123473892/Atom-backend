//create and send token and save cookie.

const sendToken = (user,statuscode,res)=>{
    const token = user.getJwtToken();

    const options ={
        expires:new Date (
            Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000),
            httpOnly:true
    }

    res.status(statuscode).cookie('token',token,options).json({
        sucess:true,
        token,
        user
    })
}
module.exports = sendToken;