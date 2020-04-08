const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.json({
                status: 400,
                err: "User not found"
            })
        }
        req.profile = user;
        next();
    })
}