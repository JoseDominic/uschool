const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    subject:{
        type:String,
        required:true,
    },
    start_time:{
        type:String,
        required:true,
    },
    end_time:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
    },
    
    marks:{
        type:String,
        required:true,
    },
});

const Exam = mongoose.model('Exam',ExamSchema);
module.exports = Exam;
