const User = require("../models/user");
const jwt = require("jsonwebtoken"); // generate token
const expressJwt = require("express-jwt"); // authorizaton
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.json({
                status: 400,
                err: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            status: 200,
            data: user
        })
    })
};

exports.signin = (req, res) => {
    // find user based on email
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.json({
                status: 400,
                err: "User with email does not exist"
            })
        }   
            // 1. authentication in model/user
            if (!user.authenticate(password)) {
                return res.json({
                    status: 401,
                    err: "Email and password don't match"
                })
            }
            // 2. generate jwt with user id and secret
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
            // 3. persist token as "t" in cookie with expiry date
            res.cookie("t", token, {expire: new Date() + 9999})
            // 4. return response with user and token to frontend client
            const{ _id, name, email, role } = user;
            return res.json({
                status: 200,
                token,
                user: { _id, name, email, role }
            })
    })
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({
        message: "you have signed out"
    })
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) {
        return res.json({
            status: 403,
            err: "Access denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.json({
            status: 403,
            err: "Admin resource! Access denied"
        }); 
    }
    next();
}

