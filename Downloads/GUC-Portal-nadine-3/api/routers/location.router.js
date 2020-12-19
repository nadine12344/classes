//done
const express = require('express')
const locatinRouter = express.Router()
const locationModel = require('../../Models/location.model');
const slotModel = require('../../Models/slots.model');
 const hrModel=require('../../Models/hr.model');
const acadamicMemberModel=require('../../Models/academicMember.model');
locatinRouter.route('/')
.post(
  async (req, res) => {
    const newLocation= new locationModel({
        name: req.body.name, 
        type: req.body.type,
        capacity: req.body.capacity,
    }) 
    try{ const result= await newLocation.save()
        res.send(result)} 
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }
    }
    );
//delete location and make slots there unallocated
locatinRouter.route('/:locationName')
.delete(async (req, res)=>{ 
  try{
        const result= await locationModel.deleteOne({name : req.params.locationName})
        res.status(200).json({
          message: 'location deleted',
      });

        const result2= await slotModel.updateMany({location: req.params.locationName},{location: "unallocated"})
        const result3= await hrModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "unallocated"})
        const result4= await acadamicMemberModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "unallocated"})
  
     }
     
        catch(err){    console.log(err);
          res.status(500).json({
            error: err
          });}})
//update location
.put( async(req, res)=>
{ try{   
  const locationUpdated= await locationModel.findOne
  ({name : req.params.locationName} );  
  const result= await locationModel.findOneAndUpdate
            ({name : req.params.locationName}, req.body, {new: true});
            res.send(result);
            if(req.body.name){
                const result= await slotModel.updateMany({location: req.params.locationName},{location: req.body.name});
                const result3= await hrModel.updateMany({officeLocation: req.params.locationName},{officeLocation: req.body.name});
                const result4= await acadamicMemberModel.updateMany({officeLocation: req.params.locationName},{officeLocation: req.body.name});
              }
              //handles if an office is no longer an office
              if(req.body.type!="offices"&&locationUpdated.type=="offices"){
                const result5= await hrModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "unallocated"})
                const result6= await acadamicMemberModel.updateMany({officeLocation: req.params.locationName},{officeLocation: "unallocated"})
              }
            }
            catch(err){
              console.log(err);
          res.status(500).json({
            error: err
          });
            }})

module.exports = locatinRouter;
