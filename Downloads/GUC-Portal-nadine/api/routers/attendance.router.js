
const express = require('express')
const attendanceRouter = express.Router()
const attendanceModel = require('../../Models/attendence.model');
const academicMemberModel=require('../../Models/academicMember.model');
const hrmodel = require('../../Models/hr.model');
const requestsModel=require('../../Models/requests.model');
const { request } = require('express');
const { compare } = require('bcrypt');
attendanceRouter.route('/:id')
.post(
  async (req, res) => {
try{  if(req.body.signIn||req.body.signOut){
        if(req.body.signIn){
          var date=new Date(req.body.signIn);
        
date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
const result=await attendanceModel.updateOne({staffId:req.params.id},{$push:{signIn: date}});
const result2=await attendanceModel.findOne({staffId:req.params.id})
result2.signIn.sort(function (a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
});
const result3=await attendanceModel.updateOne({staffId:req.params.id},{signIn: result2.signIn });

}
if(req.body.signOut){
var date=new Date(req.body.signOut);
date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
  const result=await attendanceModel.updateOne({staffId:req.params.id},{$push:{signOut: date,}});
  const result2=await attendanceModel.findOne({staffId:req.params.id})
  result2.signOut.sort(function (a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
  const result3=await attendanceModel.updateOne({staffId:req.params.id},{signOut: result2.signOut });
 

}
res.status(200).json({
  message: 'success',
});}
  else{  res.send({
        message: 'nothing or wrong request',
    });}}
        catch(err){
          console.log(err);
          res.status(500).json({
            error: err
          });
      }
    }
    )
    .get(
        async (req, res) => {
      try{ 
       const result=await attendanceModel.findOne({staffId:req.params.id});
       res.send(result);}

              catch(err){
                console.log(err);
                res.status(500).json({
                  error: err
                });
            }
          }
          );
attendanceRouter.route('/')
.get(
    async (req, res) => {
  try{ 
  
      const date=new Date(Date.now()) ;  
   
      var startDate=new Date();
      var endDate=new Date();
    if(date.getDate()<11){
      endDate=new Date(date);
      if(date.getMonth()==0){
        startDate.setFullYear(date.getFullYear()-1);
      startDate.setMonth(11);}
      else{
        startDate.setMonth(date.getMonth()-1);
        startDate.setFullYear(date.getFullYear());
      }
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
    else{
  
      endDate=new Date(date); 
      startDate=new Date();
      startDate.setDate(11);
      startDate.setHours(7);
      startDate.setMonth(endDate.getMonth());
      startDate.setFullYear(endDate.getFullYear());
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
    }
  
  let absence=[];
    const result=await attendanceModel.find({});
    let hrPeople=await hrmodel.find({});
    let acPeople=await academicMemberModel.find({});
   let requests=await requestsModel.find({});
for(var i=new Date(startDate);i.getDate()<=endDate.getDate()&&i.getMonth()<=endDate.getMonth();i.setDate(i.getDate()+1)){
  if(!(i.getDay()=="5")){
 for(var j=0; j<result.length;j++){
  let person;
  if(result[j].staffId.includes("hr-")){
  person=hrPeople.filter(element=>element.id==result[j].staffId);}
  else{
    person=acPeople.filter(element=>element.id==result[j].staffId);
  }
  let dayoff;
if(person.length>0){
   dayoff=getDay(person[0].dayOff);}
  
 dayOff="blabla"
 
  if(!(i.getDay()==dayoff)){
    
   if(!absence.includes(result[j].staffId)){
  
  let temp=[];
  let temp2=[];
 for(var k=0;k<result[j].signIn.length;k++){
   elementTime=new Date(result[j].signIn[k]);
    elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  

  if( elementTime.getMonth()==i.getMonth() && 
    elementTime.getFullYear()==i.getFullYear()&&
    elementTime.getDate()==i.getDate()&&
    elementTime.getHours()>=7&&
    elementTime.getHours()<=18 ){ 
temp.push(result[j].signIn[k]);}
     }
     for(var k=0;k<result[j].signOut.length;k++){
      elementTime=new Date(result[j].signOut[k]);
      let timeExist=false;
for(let l=0;l<temp.length;l++){
  if(((new Date(temp[l])).getTime()) < elementTime.getTime()){
timeExist=true;
}}
       elementTime.setTime( elementTime.getTime() +elementTime.getTimezoneOffset()*60*1000 );  
     if( elementTime.getMonth()==i.getMonth() && 
       elementTime.getFullYear()==i.getFullYear()&&
       elementTime.getDate()==i.getDate()&&
       elementTime.getHours()>=7&&
      timeExist){ 
   temp2.push(result[j].signIn[k]);}
        }
if(!temp||!temp2||temp.length==0||temp2.length==0){
 
  let accepted=false;
  if(requests){
 let req2=requests.filter(element=>element.from==result[j].staffId);
if(req2){
 for(let l=0;l<req2.length;l++){
if(new Date(req2[l].dateOfRequest).getDate()==i.getDate()&&new Date(req2[l].dateOfRequest).getFullYear()==i.getFullYear()&&new Date(req2[l].dateOfRequest).getMonth()==i.getMonth()&&req2[l].status=='accepted'&&(req2[l].type=='Accidental leave'||req2[l].type=='anual leave'||req2[l].type=='sick leave'||req2[l].type=='maternity leave'||req2[l].type=='compensation leave'||req2[l].type=='leave')){
accepted=true;
break;
}}
 }}
 
 if(!accepted){
  absence.push(result[j].staffId);}
 }

     temp=[];
     temp2=[];
  }}}}}
 
    //absense have only staff with missing days now add missing hours
    //add missing hour
   
    let person;    
    for(let i=0;i<result.length;i++){
      let remaining=0;
      if(result[i].staffId.includes("hr-")){
        person=hrPeople.filter(element=>element.id==result[i].staffId);}
        else{
          person=acPeople.filter(element=>element.id==result[i].staffId);
        }
        if (person.length>0&& dayOff){
          dayoff=getDay(person[0].dayOff);
        }

      if(!(absence.includes(result[i].staffId)))  {
        
        let pointer1=0;
        let pointer2=0;
      // console.log(dayoff)
    
      let current=startDate;
  
      if(!((new Date(current)).getDay()=="5"||(new Date(current)).getDay()==dayOff )){
  remaining+=8.4;
      }
        while(pointer1<result[i].signIn.length&&pointer2<result[i].signOut.length){
         let point1=new Date(result[i].signIn[pointer1]);
         point1.setTime(  result[i].signIn[pointer1].getTime() + result[i].signIn[pointer1].getTimezoneOffset()*60*1000 );
         let point2=new Date(result[i].signOut[pointer2]);
         point2.setTime(  result[i].signOut[pointer2].getTime() + result[i].signOut[pointer2].getTimezoneOffset()*60*1000 );    
          
       
   if((new Date(point1)).getTime()>=startDate.getTime()&&(new Date(point1)).getTime()<=endDate.getTime()
         &&(new Date(point1)).getHours()>=7&&((new Date(point1)).getHours()<=18)){
          
          if(!((current.getDate()==(new Date(point1)).getDate()&&current.getMonth()==(new Date(point1)).getMonth()&&
          current.getFullYear()==(new Date(point1)).getFullYear()))){
            current=new Date(point1);
            if(!(current.getDay()=="5"||current.getDay()==dayOff )){
              remaining+=8.4;
            }}

  if((new Date(point2)).getTime()>=startDate.getTime()&&(new Date(point2)).getTime()<=endDate.getTime()&&
  (new Date(point2)).getTime()>(new Date(point1)).getTime() &&(new Date(point2)).getHours()>=7){

if( (new Date(point2)).getDate()>(new Date(point1)).getDate()||
(new Date(point2)).getMonth()>(new Date(point1)).getMonth()||
(new Date(point2)).getFullYear()>(new Date(point1)).getFullYear()){
  pointer1=pointer1+1;
}
else if((pointer1+1<result[i].signIn.length)&&(
  new Date(result[i].signIn[pointer1+1])).getTime()>=(new Date(point1)).getTime()&&
  (new Date(result[i].signIn[pointer1+1])).getTime()<=(new Date(point2)).getTime()){
    pointer1=pointer1+1;
}
else{

  let endHour;
  let endminutes;
  if((new Date(point2)).getHours()>=19){
    endHour=19;
    endminutes=0
  }
  else{
    endHour=(new Date(point2)).getHours();
    endminutes=(new Date(point2)).getMinutes();
  }
 
  let hourstoadd=endHour-(new Date(point1)).getHours();
  hourstoadd=hourstoadd+(endminutes-((new Date(point1)).getMinutes()))/60;

remaining=remaining-hourstoadd;
  pointer2=pointer2+1;
  pointer1=pointer1+1;
}

  }    
   else{
   pointer2=pointer2+1;  }   
        }
         else{

           pointer1=pointer1+1;}
   if((new Date(point1)).getTime()>endDate.getTime()
     ){
break;
        }
        if((new Date(point2)).getTime()>endDate.getTime()
         ){
    break;
            }
   
      }if(remaining>0){
    absence.push(result[i].staffId);}}
     
       dayoff="bla";}
   res.send(absence);}
          catch(err){
            console.log(err);
            res.status(500).json({
              error: err
            });
        }
      }
      );
      function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }  
    function getDay(day) {
    if(day=="Sunday")
    return "0";
    if(day=="Monday")
    return "1";
    if(day=="Tuesday")
    return "2";
    if(day=="Wednesday")
    return "3";
    if(day== "Thursday")
    return "4";
    if(day== "Saturday")
    return "6";
    }
module.exports = attendanceRouter;
