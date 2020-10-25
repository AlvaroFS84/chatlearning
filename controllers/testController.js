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
            console.log(req.body);
        }

        createTest = function(req,res){
            res.render('test/create_test.twig', {username:req.user.username});
        }

}

module.exports  = new TestController();