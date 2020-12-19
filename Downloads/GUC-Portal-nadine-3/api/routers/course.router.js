const express = require('express')
const courseRouter = express.Router()
const courseModel = require('../../Models/course.model');
const departmentModel = require('../../Models/department.model');
const acadamicMemberModel= require('../../Models/academicMember.model');
const academicMemberModel = require('../../Models/academicMember.model');
const requestsModel = require('../../Models/requests.model');
const slotsModel = require('../../Models/slots.model');
courseRouter.route('/')
.post(
  async (req, res) => {
 const newcourse= new courseModel({
        name: req.body.name, 
        department:req.body.department,
    });   
    try{ 
        if(req.body.department){
            const departments=await departmentModel.find().where('name').in(req.body.department).exec();
            if(departments.length!=req.body.department.length)
            {res.status(500).json({
                                message: "some departments do not exist or not array"
                               }); 
                               return;
            }
            const department=await departmentModel.updateMany( { name: { $in: req.body.department } },{$push:{courseNames: req.body.name}});
    }
        const result= await newcourse.save();
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }

    }
    );
courseRouter.route('/:courseName')
.delete(async (req, res)=>{ 
  try{
    const departmentName=req.body.department;
    console.log(departmentName);
    const department=await departmentModel.updateMany({name:departmentName},{ $pullAll: {courseNames: [req.params.courseName] }});
    res.status(200).json({
      message: 'course deleted from department',
  });
     }
        catch(err){  
          console.log(err);
          res.status(500).json({
            error: err,
          });
        }
        })

//update course
.put( async(req, res)=>
{ 
    try{
      if(req.body.department){
        const departments=await departmentModel.find().where('name').in(req.body.department).exec();
        if(departments.length!=req.body.department.length)
        {res.status(500).json({
                            message: "some departments do not exist or not array"
                           }); 
                           return;
      
      }
    }
    let name=""
    if(req.body.name)
    name=req.body.name
    else
    name=req.params.courseName
           
    const result= await courseModel.findOneAndUpdate
    ({name : req.params.courseName}, req.body, {new: true});
    res.send(result);
    if(req.body.department){
    const department=await departmentModel.updateMany({courseNames: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {courseNames: [req.params.courseName] }});
    const department2=await departmentModel.updateMany({ name: { $in: req.body.department } },{$push:{courseNames: name}});}
    else if(req.body.name!==req.params.courseName){
      const department2=await departmentModel.updateMany({courseNames: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {courseNames: name }});
      const department=await departmentModel.updateMany({courseNames: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {courseNames: [req.params.courseName] }});
      const acadamic=await academicMemberModel.updateMany({courses: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {courses: name }});
      const acadamic2=await academicMemberModel.updateMany({courses: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {courses: [req.params.courseName] }});
      const acadamic3=await academicMemberModel.updateMany({instructorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {instructorFor: name }});
      const acadamic4=await academicMemberModel.updateMany({instructorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {instructorFor: [req.params.courseName] }});
      const acadamic5=await academicMemberModel.updateMany({coordinatorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $push: {coordinatorFor: name }});
      const acadamic6=await academicMemberModel.updateMany({coordinatorFor: { $elemMatch: {$eq:req.params.courseName}}},{ $pullAll: {coordinatorFor: [req.params.courseName] }});
      const acadamic7=await requestsModel.updateMany({course:req.params.courseName},{course:name});
      const acadamic8=await slotsModel.updateMany({course:req.params.courseName},{course:name});
     }
           }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})

module.exports = courseRouter;








