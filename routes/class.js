const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {v4:uuidv4} = require('uuid');
const User = require('../models/User');

// create a new live class room
router.get('/live',ensureAuthenticated,(req, res) => {
    //res.redirect(`/class/live/${req.user.name}`);
    res.render('live-room',{layout:false,roomId:uuidv4(),user:req.user.name,role:req.user.role})
})

// router.get('/live/:roomid',ensureAuthenticated,(req,res) => {
//     res.render('live-room',{layout:false,roomId:req.params.roomid,user:req.params.roomid})
// })

//join a live class with roomId
router.post('/live/join',ensureAuthenticated,(req,res) => {
    const {roomId} = req.body;
    console.log(roomId);
    let errors = [];
    //check if roomId is filled
    if (!roomId){
        errors.push("Please enter a roomId");
    }

    if (errors.length >0) {
        res.render('student_dashboard',{errors});
    }
    else{
        res.render('live-room',{layout:false,roomId,user:req.user.name,role:req.user.role});
    }

});

//leave class
router.get('/leave',ensureAuthenticated,(req,res) => {
    if(req.user.role == 'student'){
        res.render('student_dashboard',{name:req.user.name});
    }
    else{
        res.render('teacher_dashboard',{name:req.user.name});
    }
})

router.get('/attendance',(req,res) => {
    let Students = []
    User.find({role:'student'}, (err,result) => {
        if(err){
            console.log(err);
            result.redirect('/user/login');
        }
        else{
            console.log(result);
            result.forEach( (student) => {
                Students.push(student);
            })
            res.render('attendanceReport',{result:Students,name:req.user.name});
        }
    })
})

module.exports = router;