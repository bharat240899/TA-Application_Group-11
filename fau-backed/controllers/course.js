const formidable = require('formidable');
const _=require("lodash");
const fs = require('fs')
const Job = require("../models/course");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { error } = require("console");


exports.jobById=(req,res,next,_id) =>{
    
    Job.findById(_id).exec((err,job) => {
        if (err || !job){
            return res.status(400).json({
                error:"job not found"
            })            
        }
        req.job=job;
        next();
    });
};
exports.read = (req,res) =>{
    return res.json(req.job)
}
exports.create = (req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields)=>{
        console.log(fields)
        //check for all fields
        const {coursename,description}=fields
        if( !coursename || !description ){
            return res.status(400).json({
                error:"All fields are required"
            }) 
        }
        let job = new Job(fields)
        job.save((err, result) =>  { 
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(result);
        });
    })

};
exports.update = (req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields)=>{
        console.log(fields)
        //check for all fields
        const {coursename,description}=fields
        let job = req.job;
        job =_.extend(job,fields);
        job.save((err, result) =>  { 
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(result);
        });
    })

};
exports.remove = (req,res) =>{
    let job =req.job
    job.remove((err,deletedJob) =>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            });

        }
        res.json({
          
            "message":"Job  deleted successfully"
        })
    })
}

exports.list =(req,res) =>{
    let order = req.query.order ? req.query.order :'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy :'_id'
    let limit = req.query.limit ? parseInt(req.query.limit) :100


    Job.find()
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,postings)=>{
            if(err){
                return res.status(400).json({
                    error:"Postings not found"
                })
            }
            res.json(postings);
        })

}
