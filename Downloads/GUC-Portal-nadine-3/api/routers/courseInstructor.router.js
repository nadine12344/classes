//STUBS
const express = require('express');
const {
    func
} = require('joi');
const router = express.Router();
const academicMemberModel = require('../../Models/academicMember.model');
const courseModel = require('../../Models/course.model');
const departmentModel = require('../../Models/department.model');
const requestsModel = require('../../Models/requests.model');
const slotsModel = require('../../Models/slots.model');
const {
    requestStatus,
    requestType
} = require('../enums');
const { route } = require('./schedule.router');

router.get('/courseCoverage', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let coverageArray = [];    
    let slotsForCourses = await slotsModel.find({ course: { $in: authorizationToken.courseNames } });
     
    for (let i = 0; i < authorizationToken.courseNames.length; i++){
        let x = 0;
        let y = 0;
        let c = authorizationToken.courseNames[i];
       
        for (let j = 0; j < slotsForCourses.length; j++){
            if (slotsForCourses[j].course.toString().localeCompare(c) == 0) {
                y++;
                if (slotsForCourses[j].academicMember)
                    x++;
            }
        }
        if (y == 0) {
            coverageArray.push({ Course: c, Coverage: "100%" });
        }
        else {
           
              coverageArray.push({
                  Course: c,
                  Coverage: x*100.0/y +"%"
              });
        }
    }
    res.send(coverageArray);
});

router.get('/slotsAssignment', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let slotsForCourse = await slotsModel.find({
        course: {
            $in: authorizationToken.courseNames
        }
    });
    
    res.send(slotsForCourse);
});

router.get('/viewStaffByDep', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }

    let department = await academicMemberModel.find({
        id: authorizationToken.id
    })
    department = department[0].department;
    let acadmics = await academicMemberModel.find({ department: department });
    res.send(acadmics);
});

router.get('/viewStaffByCourse', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let acadmics = await academicMemberModel.find({
        courses: { $in: authorizationToken.courseNames }
    });
    res.send(acadmics);
});

router.post('/assignSlotToMember', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let slot_id = req.body._id;
    let myAcademic = req.body.academicID;
    let slot = await slotsModel.find({ _id: slot_id });
    if (slot.length == 0) {
        res.send("wrong slot _id");
        return;
    }
    if (slot[0].academicMember) {
        res.send(" slot already assigned to someOne else");
        return;
    }
    let myCourse = slot[0].course;
    
    myAcademic = await academicMemberModel.find({ id: myAcademic });
    if (myAcademic.length == 0) {
        res.send("wrong academic id");
    }
    myAcademic = myAcademic[0];
    let x = 0;
    for (let i = 0; i < myAcademic.courses.length; i++) {

        if (myAcademic.courses[i].toString().localeCompare(myCourse) == 0)
            x++;
    }
    for (let i = 0; i < authorizationToken.courseNames.length; i++) {

        if (authorizationToken.courseNames[i].toString().localeCompare(myCourse) == 0)
            x++;
    }
    if (x < 2) {
        res.send("YOU or academic member don't teach the course");
        return;
    }
    await slotsModel.updateOne({ _id: slot[0]._id }, { academicMember: myAcademic.id });
    res.send("slot assigned successfully");
});
router.post('/updateSlotAssignmentToMember', async (req, res) => {
     let authorizationToken = authorizeCourseInstructor();
     if (!authorizationToken.aurthorized) {
         res.send("You are not authorized for this request");
         return;
     }
     let slot_id = req.body._id;
    let myAcademic = req.body.academicID;
    let courseNew = req.body.courseName;

     let slot = await slotsModel.find({
         _id: slot_id
     });
     if (slot.length == 0) {
         res.send("wrong slot _id");
         return;
     }
     if (authorizationToken.courseNames.filter(
             (course) => course.toString().localeCompare(slot[0].course) == 0).length == 0) {
         res.send("you are not an instructor for the course given in this slot");
         return;
     }
     if (authorizationToken.courseNames.filter(
             (course) => course.toString().localeCompare(courseNew) == 0).length == 0) {
         res.send("you are not an instructor for the New course");
         return;
     }
    let academicFromModel = await academicMemberModel.find({ id: myAcademic });
    academicFromModel = academicFromModel[0];
    if (academicFromModel.courses.filter(
        (course)=>course.toString().localeCompare(courseNew)==0
    ).length == 0) {
        res.send("academic doesn't teach the new course");
        return;
    }
     if (!slot[0].academicMember || slot[0].academicMember.toString().localeCompare(myAcademic) != 0) {
         res.send("The slot is not Assigned to the academic member inserted");
         return;
     }
    await slotsModel.updateOne({ _id: slot_id }, { course: courseNew });
    res.send("Assigned same slot to same Member but with new course successfully");
})
router.post('/deleteSlotAssignmentFromMember', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let slot_id = req.body._id;
    let myAcademic = req.body.academicID;
    let slot = await slotsModel.find({
        _id: slot_id
    });
    if (slot.length == 0) {
        res.send("wrong slot _id");
        return;
    }
    if (authorizationToken.courseNames.filter(
        (course) => course.toString().localeCompare(slot[0].course) == 0).length == 0) {
        res.send("you are not an instructor for the course given in this slot");
        return;
        }
    if (!slot[0].academicMember || slot[0].academicMember.toString().localeCompare(myAcademic) != 0) {
        res.send("The slot is not Assigned to the academic member inserted");
        return;
    }
    await slotsModel.updateOne({
                _id: slot_id
    }, {
        $unset: {
            academicMember: 1
        }
    });
    res.send("slot assignment deleted successfully")
});

router.post('/makeCoordinator', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let myAcademic = req.body.academicID;
    let myCourse = req.body.courseName;
    if ((authorizationToken.courseNames.filter((course) => course.toString().localeCompare(myCourse) == 0))
        .length == 0) {
        res.send("you are not instructor for this course");
        return;
    }
    myAcademic = await academicMemberModel.find({ id: myAcademic });
    myAcademic = myAcademic[0];
    if (myAcademic.courses.filter((course) => course.toString().localeCompare(myCourse) == 0)
        .length == 0) {
        res.send("the academic doesn't teach this course");
        return;
    }
    if (myAcademic.coordinatorFor.filter((course) => course.toString().localeCompare(myCourse)) == 0
        .length != 0) {
        res.send("the academic is already a coordinator for the course");
        return;
    }
    myAcademic.coordinatorFor.push(myCourse);
    await academicMemberModel.updateOne({
        id: myAcademic.id
    }, {
        coordinatorFor: myAcademic.coordinatorFor
    });
    res.send("Made coordinator successfullly")
        
});

router.post('/assignAcademicToCourse', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let myAcademic = req.body.academicID;
    let myCourse = req.body.courseName;
    if ((authorizationToken.courseNames.filter((course) => course.toString().localeCompare(myCourse) == 0))
        .length == 0) {
        res.send("you are not instructor for this course");
        return;
    }
    myAcademic = await academicMemberModel.find({
        id: myAcademic
    });
    myAcademic = myAcademic[0];
   
    
    if (myAcademic.courses.filter((course) => course.toString().localeCompare(myCourse) == 0)
        .length != 0) {
        res.send("the academic already assigned to this course");
        return;
    }
    //NOT TESTED 
    let courseFromModel = await courseModel.find({ name: myCourse });
    courseFromModel = courseFromModel[0];
    if (courseFromModel.department.filter(
        (dep)=>dep.toString().localeCompare(myAcademic.department)
    ).length == 0) {
        res.send("Academic member doesn't work under either departments that teach the course")
        return;
    }
    //TESTED
     myAcademic.courses.push(myCourse);
    await academicMemberModel.updateOne({ id: myAcademic.id }, { courses: myAcademic.courses })
    res.send("academic assigned Successfully");
})
router.post('/removeAcademicFromCourse', async (req, res) => {
    let authorizationToken = authorizeCourseInstructor();
    if (!authorizationToken.aurthorized) {
        res.send("You are not authorized for this request");
        return;
    }
    let myAcademic = req.body.academicID;
    let myCourse = req.body.courseName;
    if ((authorizationToken.courseNames.filter((course) => course.toString().localeCompare(myCourse) == 0))
        .length == 0) {
        res.send("you are not instructor for this course");
        return;
    }
    myAcademic = await academicMemberModel.find({
        id: myAcademic
    });
    myAcademic = myAcademic[0];
    if (myAcademic.courses.filter((course) => course.toString().localeCompare(myCourse) == 0)
        .length == 0) {
        res.send("the academic doesn't teach this course");
        return;
    }
    await academicMemberModel.updateOne({ id: myAcademic.id }, {
        courses: myAcademic.courses.filter(
            (course) => course.toString().localeCompare(myCourse) != 0
        ), instructorFor: myAcademic.instructorFor.filter(
            (course) => course.toString().localeCompare(myCourse) != 0
        ),
        coordinatorFor: myAcademic.coordinatorFor.filter(
            (course) => course.toString().localeCompare(myCourse) != 0
        )
    });
    await slotsModel.updateMany({
        academicMember: myAcademic.id,
        course: myCourse
    }, {
        $unset: {
            academicMember: 1
        }
    });
    
    res.send("all Academic assignments to this Course are removed successfully");
});

//STUBS
function authorizeCourseInstructor(request) {
    // if (request.user.role === "Course Instructor")
    //     return true;
    // return false;
    return {
        // id:req.user.id,
        id:"1",
         aurthorized: true,
         courseNames:[ "CSEN201"]
     };
}
module.exports = router;