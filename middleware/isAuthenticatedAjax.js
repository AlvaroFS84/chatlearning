var isAuthenticatedAjax = function (req, res, next) {
    if(!req.isAuthenticated()){
        res.status(401)
        res.send({
            message:'Debe autenticarse para utilizar este recurso'
        });
    }else{
        next();
    }
    
};

  module.exports = isAuthenticatedAjax;
  