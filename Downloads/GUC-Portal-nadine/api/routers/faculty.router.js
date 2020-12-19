//done
const express = require('express')
const facultyRouter = express.Router()
const facultyModel = require('../../Models/faculty.model');
const departmentModel = require('../../Models/department.model');
facultyRouter.route('/')
.post(
  async (req, res) => {
    const newfaculty= new facultyModel({
        name: req.body.name, 
    }) 
    try{ 
        const result= await newfaculty.save()
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }
    }
    );
facultyRouter.route('/:facultyName')
.delete(async (req, res)=>{ 
  try{
        const result= await facultyModel.deleteOne({name : req.params.facultyName})
        res.status(200).json({
          message: 'faculty deleted',
      });
      try{
        const result= await departmentModel.updateMany({faculty: req.params.facultyName},{faculty: "undefined"})
     
     }catch(err){    console.log(err);
      res.status(500).json({
        error: err
      });
  }
     }
        catch(err){    console.log(err);
          res.status(500).json({
            error: err
          });}})
//update faculty
.put( async(req, res)=>
{ try{
            const result= await facultyModel.findOneAndUpdate
            ({name : req.params.facultyName}, req.body, {new: true});
            res.send(result);
            if(req.body.name){
              try{
                const result= await departmentModel.updateMany({faculty: req.params.facultyName},{faculty: req.body.name})
             
             }catch(err){    console.log(err);
              res.status(500).json({
                error: err
              });}
            }
           }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})

module.exports = facultyRouter;
