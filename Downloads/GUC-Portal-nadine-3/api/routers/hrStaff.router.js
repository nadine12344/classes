const express = require('express')
const bcrypt=require(('bcrypt'));
const hrStaffRouter = express.Router()
const locationModel = require('../../Models/location.model');
const hrStaff = require('../../Models/hr.model');
const counterModel = require('../../Models/counters.model');
const attendanceModel=require('../../Models/attendence.model');
const academicMemberModel=require('../../Models/academicMember.model');
hrStaffRouter.route('/')
.post(
  async (req, res) => {
 const newhrStaff= new hrStaff({
    name:req.body.name,
    email:req.body.email,
    salary:req.body.salary,
    officeLocation:req.body.officeLocation,
    extraInformation:req.body.extraInformation,
    gender:req.body.gender,
    acadamic:req.body.acadamic
    });  
        try{
          const acadamic = await academicMemberModel.find({email:req.body.email});
          if(acadamic.length>0){
            res.status(500).json({
              message: "emaill already exists"
             }); 
             return;
          }
  const salt = await bcrypt.genSalt(10);
req.body.password = await bcrypt.hash("123456", salt) ;
newhrStaff.password=req.body.password;
          const count= await counterModel.find();
          let newCount;
          if((count).length>0){
             newCount=count[0].hrCount+1
            newhrStaff.id="hr-"+newCount;
            console.log("hrrrr"+count[0].hrCount)
         
          
          }
          else{
            newCount=1;
            const newCounter=new counterModel({
              hrCount:1,
              Count:1,
            } );
            newCounter.save();
            newhrStaff.id="hr-"+1;
          }
        if(req.body.officeLocation){
            const location=await locationModel.findOne({name : req.body.officeLocation});
            if(!location){
                res.status(500).json({
                   message: "location does not exist"
                  }); 
                  return;}
  if(location.type!=="offices"){
    res.status(500).json({
        message: "location is not an office"
       }); 
       return;
                      }
     if(location.capacity===location.officeOccupants){
        res.status(500).json({
            message: "office full"
           }); 
           return;          
        }
        
       }
       const newAttendance=new attendanceModel({
        staffId:newhrStaff.id
      });
        const result= await newhrStaff.save()
        const result2= await newAttendance.save()
        const count2=await counterModel.updateOne({hrCount:newCount-1},{hrCount:newCount});
        if(req.body.officeLocation){
        const new2= await locationModel.updateOne({name:req.body.officeLocation},{ $inc: {officeOccupants:1}})}
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }

    }
    );
hrStaffRouter.route('/:id')
.delete(async (req, res)=>{ 
  try{
   
    const hr= await hrStaff.findOne({id : req.params.id})
    if(hr){
      if(hr.officeLocation){
        const new1= await locationModel.updateOne({name:hr.officeLocation},   { $inc: {officeOccupants:-1}});
        }
    }
  const result= await hrStaff.deleteOne({id : req.params.id})
      res.status(200).json({
        message: 'hrStaff deleted',
    });
     }
        catch(err){    console.log(err);
          res.status(500).json({
            error: err
          });}})
//update hrStaff
.put( async(req, res)=>
{   
    try{  if(req.body.email){
      const acadamic = await academicMemberModel.find({email:req.body.email});
    if(acadamic.length>0){
      res.status(500).json({
        message: "emaill already exists"
       }); 
       return;
    }}     if(req.body.dayOff){
      res.status(500).json({
        message: "unallowed to change day off"
       }); 
       return
    }
       if(req.body.officeLocation){
          const location=await locationModel.findOne({name : req.body.officeLocation});
    if(!location){
        res.status(500).json({
           message: "location does not exist"
          }); 
          return;}
if(location.type!=="offices"){
res.status(500).json({
message: "location is not an office"
}); 
return;
              }
if(location.capacity===location.officeOccupants){
res.status(500).json({
    message: "office full"
   }); 
   return;          
}
const staff= await hrStaff.findOne({id : req.params.id});
console.log(staff);
const result= await hrStaff.findOneAndUpdate
({id : req.params.id}, req.body, {new: true});
if(staff.officeLocation){
const new1= await locationModel.updateOne({name:staff.officeLocation},   { $inc: {officeOccupants:-1}});
}
const new2= await locationModel.updateOne({name:req.body.officeLocation},{ $inc: {officeOccupants:1}})
res.send(result);}
else{
  const result= await hrStaff.findOneAndUpdate
({id :req.params.id}, req.body, {new: true});
res.send(result);
}
           
           }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})
 hrStaffRouter.route('/salary/:id')
 .put( async(req, res)=>
 {  
     try{    

 const result= await hrStaff.findOneAndUpdate({id :req.params.id}, {salary:req.body.salary}, {new: true});

 res.send(result);}
             catch(err){
               console.log(err);
           res.status(500).json({
             error: err
           });
             }})
module.exports = hrStaffRouter;
