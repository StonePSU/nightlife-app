'use strict';

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.clearCookie("last-search");
    }
    
    next();
}