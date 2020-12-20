const Test = require('../models/test');
const Question = require('../models/question');


    saveTest = function(req, res){
        var test = new Test();
        test.title = req.body.title;
        test.questions = req.body.questions;
        test.user = req.user;
        test.save(function(err){
            if(err){
                res.send({
                    status: 'ko',
                    error: err.message
                });
            }else{
                res.send({
                    status:'ok'
                });
            }
            
        });
    }

    createTest = function(req,res){
        res.render('test/create_test.twig', {username:req.user.username});
    }



module.exports  = { saveTest, createTest };