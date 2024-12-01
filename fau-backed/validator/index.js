exports.userSignupValidator=(req,res,next)=>{
    req.check("fname","First Name is required").notEmpty();
    req.check("lname","Last Name is required").notEmpty();
    req.check("znumber","Z number is required").notEmpty();
    req.check("email","Email must be between 3 to 32 charcters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min:4,
            max:32
        })
    req.check("password","Password is required").notEmpty();
    req.check("password")
        .isLength({min:6})
        .withMessage("Password must contain atleast 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map(error=>error.msg)[0];
        return res.status(400).json({error:firstError})
    }    
    next();
}
exports.resetPasswordValidator=(req,res,next)=>{
    req.check("otp","Otp is required").notEmpty();
    req.check("newPassword","Password is required").notEmpty();
    req.check("newPassword")
        .isLength({min:6})
        .withMessage("Password must contain atleast 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map(error=>error.msg)[0];
        return res.status(400).json({error:firstError})
    }    
    next();
}