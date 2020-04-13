const User = require("../models/user");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.json({
                status: 400,
                err: "User not found"
            })
        }
        req.profile = user;
        next();
    })
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate({
        _id: req.profile._id
    }, {
        $set: req.body
    }, {
        new: true
    }, (err, user) => {
        if (err) {
            return res.json({
                status: 400,
                err: "Your are not authorized to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({
            status: 200,
            user
        })
    })
};