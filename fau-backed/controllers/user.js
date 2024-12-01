const User=require('../models/user')
exports.userById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        req.profile=user;
        next();
    }) 


};

//user reading data
exports.read = (req,res) => {
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    return res.json(req.profile)
}

//user updating his data

exports.update =(req, res)=>{
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true},
        (err,user) =>{
            if(err){
                return res.status(400).json({
                    error:'You are not authorized to perform this action'
                })
            }
          user.hashed_password=undefined;
           user.salt=undefined; 
           res.json(user);
        }
    ) 
}
//list all users
exports.list =(req,res) =>{
    User.find().exec((err,data) => {
     if(err) {
         return res.status(400).json({
             error:errorHandler(err)
         })
     }
     res.json(data)
    })
 }