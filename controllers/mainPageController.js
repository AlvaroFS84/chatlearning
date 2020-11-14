const Test = require('../models/test');



    showMainPage = function(req, res){
        Test.find({}).populate('user').exec(function(err, tests){
            var username = req.user.username; 
            var html = printTests(tests);
            
            res.render('main/index.twig', {
                username: username,
                tests:html,
                error:err
            });
        });
    }

    logout = async function(req, res){
        req.user.connected = false;
        await req.user.save();
        req.logout();
        return res.redirect('/login');
    }

    printTests = function(tests){
        var html =` <div class="col-sm-12 col-lg-8 offset-lg-2 tests-container">`;

        tests.forEach(function(test){
            var html_item = `
            <div class="col-sm-12 test-item" data-test-id="${ test._id }">
                    <div class="col-sm-6 test-item-title">
                        ${ test.title }
                    </div>
                    <div class="col-sm-3 test-item-user">
                        ${ test.user.username }
                    </div>
                    <div class="col-sm-3">
                        <button onclick="go_to_test('${ test._id}')" class="test-item-button btn base-btn rounded-input">
                            Seleccionar
                        </button>
                    </div>
                </div>`;
            html += html_item;
        });

        return html += '</div>'
    }

    searchTest = function(req, res){
        var test_name = req.query.searched 
        var searching_info = test_name.length == 0?{}:{'title':  new RegExp('.*'+test_name+'.*', "i") };
        Test.find(searching_info).populate('user').exec(function(err, tests){
            var html = printTests(tests);
            
            var response = {
                status:err?'ko':'ok',
                data: {
                    html:html,
                    error:err
                }
            }
    
            res.send(response);
        });
    }


module.exports = { showMainPage, logout, searchTest };