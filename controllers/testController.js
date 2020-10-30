const Test = require('../models/test');
const Question = require('../models/question');

class TestController{

        saveTest = function(req, res){
            /*let test = new Test();
            test.title = 'test de prueba';
            let question = new Question;
            question.text = 'texto de prueba';
            question._test = test;
            question.save();

            test.questions = [question];
            test.save();*/
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

}

module.exports  = new TestController();