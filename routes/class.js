const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {v4:uuidv4} = require('uuid');
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs')

// SET STORAGE using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

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

//render attendance report using float btn data
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

//save recorded file to server
var upload = multer({ storage:storage});

var type = upload.single('upl');
router.post('/save',type,(req,res) => {
    //console.log(req.body);
    console.log(req.file);
    // do stuff with file
    res.send('Success');
})

//view recorded classes list
router.get('/records', ensureAuthenticated,(req,res) => {
    const Folder = 'public/uploads/';
    let files = []
    fs.readdirSync(Folder).forEach(file => {
        files.push(file);
    });
    console.log(files);
    res.render('recorded_class_list',{result:files,name:req.user.name,role:req.user.role});
})

//see a recorded video
router.get('/view/:filename', ensureAuthenticated, (req,res) => {
    res.render('view_video',{filename:req.params.filename,name:req.user.name,role:req.user.role});
})

//discussion forum
router.get('/forum', ensureAuthenticated,(req,res) => {
    let roomName = 'Doubts here..';
    res.render('discussion_forum',{layout:false,username:req.user.name,room:roomName,role:req.user.role});
})

router.post('/forum',ensureAuthenticated, (req,res) => {
    res.render('discussion_forum',{layout:false,username:req.user.name,room:req.body.room,role:req.user.role});
})

//chat bot
router.get('/bot',ensureAuthenticated,(req,res) => {
    res.render('bot',{layout:false,name:req.user.name});
})

module.exports = router;