/**
 * Comprueba si el usuario está autenticado en una peticion ajax
 * @param req 
 * @param res 
 * @param next 
 */
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
  