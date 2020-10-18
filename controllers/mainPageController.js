class MainPageController{

    showMainPage = function(req, res){
        res.render('main/index.twig', {username:req.user.username});
    }

    logout = function(req, res){
        req.logout();
        return res.redirect('/');
    }
}

module.exports = new MainPageController();