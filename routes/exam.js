const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {v4:uuidv4} = require('uuid')
const Exam = require('../models/Exam');

// create a new live class room
router.get('/init',ensureAuthenticated,(req, res) => {
    //res.redirect(`/class/live/${req.user.name}`);
    res.render('exam-init',{name:req.user.name});
})

router.get('/room',ensureAuthenticated,(req,res)=>{
    res.render('exam-room',{});
})
router.get('/init/teacher',ensureAuthenticated,(req,res)=>{
    res.render('exam-init-teacher',{name:req.user.name});
})
// router.get('/live/:roomid',ensureAuthenticated,(req,res) => {
//     res.render('live-room',{layout:false,roomId:req.params.roomid,user:req.params.roomid})
// })

//join a live class with roomId
router.post('/init/teacher',ensureAuthenticated,(req,res) => {
    const{subject,marks,date,start_time,end_time} = req.body;
    const newExam = new Exam({
        subject,marks,date,start_time,end_time
    });
    newExam.save().catch(error=>{
        console.log(error);
    })

});


module.exports = router;