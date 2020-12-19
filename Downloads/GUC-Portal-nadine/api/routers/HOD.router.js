const express = require('express');
const router = express.Router();
const academicMemberModel = require('../../Models/academicMember.model');
const courseModel = require('../../Models/course.model');
const departmentModel = require('../../Models/department.model');
const requestsModel = require('../../Models/requests.model');
const slotsModel = require('../../Models/slots.model');
const notificationModel = require('../../Models/notification.model');
const {
    requestStatus,
    requestType
} = require('../enums');

router.post('/makeInstructor', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const academicID = req.body.academicID;
    const courseName = req.body.courseName;
   
     let myAcademic=await academicMemberModel.find({
        id: academicID
    });
  
      let myCourse=await courseModel.find({
        name: courseName
    });
    if (myAcademic.length == 0) {
        res.send("Academic Id doesn't exist");
        return;
    }
    if (myCourse.length == 0) {
        res.send("Course Name doesn't exist");
        return;
    }
    if (myAcademic[0].department.localeCompare(authorizationToken.department) != 0) {
        res.send("Academic is not in your department");
        return;
    }
    if (myCourse[0].department.filter((depName) => {
        return depName.localeCompare(authorizationToken.department) == 0
    }).length == 0) {
        res.send("Course is not under your department");
        return;
        }
    let instructorForMe = myAcademic[0].instructorFor;
    instructorForMe.push(courseName);
    await academicMemberModel.updateOne({ id: academicID }, { instructorFor: instructorForMe });
    res.send("instructor added")
    
})

router.post('/deleteInstructor', async (req, res) => {

   const authorizationToken = authorizeHOD();
   if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const academicID = req.body.academicID;
    const courseName = req.body.courseName;
     
     let myAcademic=await academicMemberModel.find({
         id: academicID
     });
    
    let myCourse=await courseModel.find({
        name: courseName
    });
    if (myAcademic.length == 0) {
        res.send("Academic Id doesn't exist");
        return;
    }
    if (myCourse.length == 0) {
        res.send("Course Name doesn't exist");
        return;
    }
     if (myAcademic[0].department.localeCompare(authorizationToken.department) != 0) {
         res.send("Academic is not in your department");
         return;
     }
     if (myCourse[0].department.filter((depName) => {
             return depName.localeCompare(authorizationToken.department) == 0
         }).length == 0) {
         res.send("Course is not under your department");
         return;
     }
    let instructorForMe = myAcademic[0].instructorFor;
    instructorForMe = instructorForMe.filter((course) => course.localeCompare( courseName)==0);
    await academicMemberModel.updateOne({
        id: academicID
    }, {
        instructorFor: instructorForMe
    });
    res.send("instructor removed");

});

router.post('/updateInstructor', async (req, res) => {

   const authorizationToken = authorizeHOD();
   if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const academicID = req.body.academicID;
    const courseOld = req.body.courseOld;
    const courseNew = req.body.courseNew;
  
      let myAcademic=await academicMemberModel.find({
        id: academicID
    });
   
    let myCourseOld= await courseModel.find({
        name: courseOld
    });
    
    let myCourseNew=await courseModel.find({
        name: courseNew
    });
    if (myAcademic.length == 0) {
        res.send("Academic Id doesn't exist");
        return;
    }
    if (myCourseOld.length == 0) {
        res.send("Old Course Name doesn't exist");
        return;
    }
    if (myCourseNew.length == 0) {
        res.send("New Course Name doesn't exist");
        return;
    }
     if (myAcademic[0].department.localeCompare(authorizationToken.department) != 0) {
         res.send("Academic is not in your department");
         return;
     }
     if (myCourseNew[0].department.filter((depName) => {
             return depName.localeCompare(authorizationToken.department) == 0
         }).length == 0) {
         res.send("New Course is not under your department");
         return;
     }
    if (myCourseOld[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("Old Course is not under your department");
        return;
    }

    let instructorForMe = myAcademic[0].instructorFor;
    instructorForMe = instructorForMe.filter((course) => course.localeCompare(courseOld)==0);
    instructorForMe.push(courseNew);
    await academicMemberModel.updateOne({
        id: academicID
    }, {
        instructorFor: instructorForMe
    });
    res.send("instructor updated");

});

router.get('/viewStaffByDepartment', async (req, res) => {
   
   const authorizationToken = authorizeHOD();
   if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
   }
    const departmentName = authorizationToken.department;
    //redundant check on department
    
    let myDepartment=await departmentModel.find({
                name: departmentName
            });
    if (myDepartment.length == 0) {
        res.send("No such department");
        return;
    }

   
     let academicsInDep=await academicMemberModel.find({
                 department: departmentName
             });
    res.send(academicsInDep);
});

router.post('/viewStaffByCourseName', async (req, res) => {
    
   const authorizationToken = authorizeHOD();
   if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
   }
    const courseName = req.body.courseName;
    
    let myCourse=await courseModel.find({
        name: courseName
    });
    if (myCourse.length == 0) {
        res.send("No such course");
        return;
    }
    if (myCourse[0].department.filter((depName) => {
            return depName.localeCompare(authorizationToken.department) == 0
        }).length == 0) {
        res.send("Course is not under your department");
        return;
    }
    const departmentName = authorizationToken.department;
    
    let academicsInDepAndCourse = await academicMemberModel.find({
        department: departmentName,
        courses: courseName
    }
        
    );
    res.send(academicsInDepAndCourse);
});

router.get('/viewDaysOffInDepartment', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    const departmentName = authorizationToken.department;
    //redundant check on department
   
     let myDepartment=await departmentModel.find({
        name: departmentName
    });
    if (myDepartment.length == 0) {
        res.send("No such department");
        return;
    }

    
    let daysOffInDep=await academicMemberModel.find({
        department: departmentName
    });
    if (req.body.academicID) {
        daysOffInDep.filter((academicMember) => academicMember.id.localeCompare(req.body.academicID) == 0);

    }
    daysOffInDep = daysOffInDep.map((member) => member.dayOff);
    res.send(daysOffInDep);
});

router.get('/viewChangeDayOffRequests', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
   
  
    let changeDayOffreq = await requestsModel.find({
        type: requestType.CHANGE_DAY_OFF
    });
    
   
    let result = [];
    for (let i = 0; i < changeDayOffreq.length; i++){
         let dep = await getDepartment(changeDayOffreq[i].from);
        if (dep.toString().localeCompare(authorizationToken.department) == 0)
            result.push(changeDayOffreq[i]);
    }
    
    res.send(result);

});

router.get('/viewLeaveRequests', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let leaveRequestTypes = [requestType.LEAVE, requestType.SICK_LEAVE, requestType.ANNUAL_LEAVE,
        requestType.MATERNITY_LEAVE, requestType.ACCIDENTAL_LEAVE, requestType.COMPENSATION_LEAVE
    ]
    let leaveReq=await requestsModel.find({
        type: {$in:leaveRequestTypes}
    });
    let result = [];
    for (let i = 0; i < leaveReq.length; i++){
        let dep = await getDepartment(leaveReq[i].from);
        if (dep.localeCompare(authorizationToken.department) == 0)
            result.push(leaveReq[i]);
    }
    res.send(result);
});

router.post('/rejectRequest', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let reqID = req.body._id;
    
    
    let myAcademic=await requestsModel.find({
                _id: reqID
    });
    myAcademic = myAcademic[0].from;
    
    let dep=await academicMemberModel.find({
                id: myAcademic
    });
    dep = dep[0].department;
    if (dep.localeCompare(authorizationToken.department) !== 0) {
        res.send("academic is not in your department");
        return;
    }
    await requestsModel.updateMany({_id: reqID},{status:requestStatus.REJECTED}, (err, docs) => {
       
    });
    await notificationModel.insertMany([{academicMember:myAcademic,request:reqID}])
    res.send("request rejected successfully")
});
router.post('/acceptRequest', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
    let reqID = req.body.id;
    let myAcademic;
    let myReq;
    let x=await requestsModel.find({
        _id: reqID
    });
    myReq = x[0];
    myAcademic = x[0].from;
    
    let dep=await academicMemberModel.find({
        id: myAcademic
    });
    dep = dep[0].department;
    if (dep.localeCompare(authorizationToken.department) !== 0) {
        res.send("academic is not in your department");
        return;
    }

    await requestsModel.updateMany({_id: reqID}, {status: requestStatus.ACCEPTED}, (err, docs) => {
        
    });
    let leaveRequestTypes = [requestType.LEAVE, requestType.SICK_LEAVE, requestType.ANNUAL_LEAVE,
    requestType.MATERNITY_LEAVE,requestType.ACCIDENTAL_LEAVE,requestType.COMPENSATION_LEAVE
    ]
    leaveRequestTypes = leaveRequestTypes.filter((type) => myReq.type == type);
    if (leaveRequestTypes.length == 0&&myReq.type!=requestType.CHANGE_DAY_OFF) {
        res.send("A HOD cannot handle " + myReq.type + "leaves");
        return;
    }
    if (myReq.type != requestType.CHANGE_DAY_OFF) {
        res.send("Leave Request Accepted");
        return;
    }

    await academicMemberModel.updateOne({ id: myAcademic }, { dayOff: myReq.dayOff })
    await notificationModel.insertMany([{
        academicMember: myAcademic,
        request: reqID
    }]);
    res.send("Change Day off request accepted");
    
})

router.get('/courseCoverage', async (req, res) => {
    const authorizationToken = authorizeHOD();
    if (!authorizationToken.aurthorized) {
        res.send("you are not HOD : NOT AUTHORIZED");
        return;
    }
   
    let coursesInDep= await courseModel.find({
                department: authorizationToken.department
            });
    coursesInDep = coursesInDep.map(element => element.name);
   
    let slotsInDep= await slotsModel.find({
                course: {
                    $in: coursesInDep
                }
            });
    let coveredSlotsPerCourse=[];
    coursesInDep.forEach((course) => {
        let slotsIncourse = slotsInDep.filter((slot) => { return slot.course.localeCompare(course) == 0 });

        let coveredSlots = slotsIncourse.filter((slot) => {
             
            if (slot.academicMember)
                return true;
            return false;
        });
        if (slotsIncourse.length == 0)
            coveredSlotsPerCourse.push({ Course: course, Coverage: "100%" });
        else {
            let cov = coveredSlots.length * 1.0 / slotsIncourse.length;
            cov *= 100;
            cov = "" + cov;
            coveredSlotsPerCourse.push({
                Course: course,
                Coverage: cov
            });
        }
    });
    res.send(coveredSlotsPerCourse);
   

});

router.post('/teachingAssignmentsOfCourse', async (req, res) => {
     const authorizationToken = authorizeHOD();
     if (!authorizationToken.aurthorized) {
         res.send("you are not HOD : NOT AUTHORIZED");
         return;
     }
    let courseName = req.body.courseName;
    if (!courseName) {
        res.send("you didn't provide a course name");
        return;
    }
    
    let slotsIncourse=await slotsModel.find({
                course: courseName
            });
    slotsIncourse = slotsIncourse.filter((slot) => slot.academicMember);
    res.send(slotsIncourse);
})

//STUBS
async function getDepartment(academicID) {
  
      let res=await academicMemberModel.find({
          id: academicID
      });
    return res[0].department;
}
// NOT TESTED FROM HERE
function authorizeHOD(request) {
    // if (request.user.role == "HOD")
    //     return true;
    // return false;
    //GET THE HOD'S DEPARTMENT FROM HIS/HER ID
    return {aurthorized:true,department:"CSEN"};
    
}
module.exports = router;