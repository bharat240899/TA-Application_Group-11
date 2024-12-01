const express=require('express')
const router=express.Router()


const { 
    read,
    create, 
    list,
    remove,
    update
}=require('../controllers/course');
const {requireSignin,isAuth,isAdmin} =require("../controllers/auth");
const {userById}=require("../controllers/user");
const {jobById}=require("../controllers/course");

// //get job list
router.get('/jobs',list);
// //get job by id
router.get("/job/:jobId",read)
router.post("/job/create/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    create
);
//update jobs by userid
router.put("/job/:jobId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update

);
//delete jobs 
router.delete("/job/:jobId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove

);





router.param("userId",userById)
router.param("jobId",jobById)

module.exports=router;