/**
 * No guardar información en cache
 * @param req 
 * @param res 
 * @param next 
 */
var noCache = function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};

  module.exports = noCache;
  