const express=require('express');
const router=express.Router();

const {requireSignin,isAuth,isAdmin,isComem,isInstructor} =require("../controllers/auth");

const {userById,read,update,list}=require("../controllers/user");


router.get('/secret/:userId',requireSignin,isAuth,isAdmin,isInstructor,isComem,(req,res)=>{
    res.json({
        user:req.profile
    })
})


router.get("/user/:userId",requireSignin,isAuth,read);
router.put("/user/:userId",requireSignin,isAuth,update);
//get job list
router.get('/users',list);

router.param('userId',userById);

module.exports=router;