
/**
 * Muestra pagina de login
 */
login = (req,res) =>{
    let messages = { 'error':req.flash('error') };
    res.render('login/login.twig', messages);
}


module.exports = { login }