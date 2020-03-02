const User = require('../models/user');

module.exports = function (req, res, next) {
    if (req.user) {
        User.findById(req.user)
            .then(function (user) {
                req.user = user;
                next();
            })
            .catch(function (err) {
                res.redirect('/errorpage.html');
            })
    } else {
        next();
    }
};