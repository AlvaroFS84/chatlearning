
var isAuthenticated = function (req, res, next) {
    if(!req.isAuthenticated()) 
      return res.redirect(301,'/login');
    return next();
};

  module.exports = isAuthenticated;
  
  