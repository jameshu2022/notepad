var User = require("../models/user.js");

const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var async = require("async");
require("dotenv").config();


exports.user_list = function(req, res, next){
    // console.log(req.cookies);
    // console.log(req.cookies.TOKEN_PAYLOAD);
    // console.log(req.cookies.TOKEN_SIGNATURE);
    User.find({}, "username")
        .exec(function(err, list_users) {
            if(err) { return next(err); }
            
            res.json( {list_users : list_users} );
        });
}

exports.user_detail = function(req, res, next){
    async.parallel({
        user : function(callback) {
            User.findById(req.params.id, "username notepad")
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.user == null){ //no results ig
            var err = new Error("User not found");
            err.status = 404;
            return next(err);
        }
        res.json( {user : results.user} );
    }
    );
}

exports.user_notepad_get = function(req, res, next) {
    async.parallel({
        user : function(callback) {
            User.findById(req.params.id, "notepad")
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }

        if(results.user == null){
            var err = new Rror("User not found");
            err.status = 404;
            return next(err);
        }
        res.json( {notepad : results.user} );

    });
}

exports.user_apikey_get = function(req, res, next){
    res.json({apiKey : process.env.TINY_KEY});
}

exports.user_login_post = [
    body("username").trim().isLength({ min : 1})
        .escape().withMessage("Username required")
        .isAlphanumeric().withMessage("Username has non alphanumeric characters"),
    body("password").trim().isLength( {min : 1} )
        .escape().withMessage("Password required"),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            var err = new Error("Invalid Input");
            err.status = 409;
            return next(err);
        }

        async.parallel({
            user : function(callback) {

                User.findOne({"username" : req.body.username},
                callback);
            }
        }, function(err, results) {
            if(err) { return next(err); }

            if(results.user != null){
                bcrypt.compare(req.body.password, results.user.password, function(err, good) {
                    // console.log("body pass " + req.body.password);
                    // console.log("results pass " + results.user.password);
                    if(good === true){
                        const token = jwt.sign({
                            "username" : results.user.username,
                            "id" : results.user._id
                        }, process.env.SECRET_KEY, {
                        expiresIn : 60 * 60 * 24 
                        });

                        var token_array = token.split(".");
                        // console.log(req.cookies);
                        // console.log(req.cookies.TOKEN_PAYLOAD);
                        // console.log(req.cookies.TOKEN_SIGNATURE);

                        res.cookie("TOKEN_PAYLOAD", 
                            token_array[0] + "." + token_array[1], {
                                // maxAge : 50000,
                                secure : true,
                                sameSite : "strict"
                            });
                        res.cookie("TOKEN_SIGNATURE", token_array[2], {
                            // maxAge : 5000,
                            secure : true,
                            httpOnly : true,
                            sameSite : "strict"
                        });

                        res.json({"token" : token});
                    } else {
                        var err = new Error("Username/password was incorrect");
                        err.status = 403;
                        return next(err);
                    }
                });
            } else {
                var err = new Error("Username/password was incorrect");
                err.status = 403;
                return next(err);
            }
        });
    }
];

exports.user_logout_post = function(req, res, next) {
    res.clearCookie("TOKEN_PAYLOAD");
    res.clearCookie("TOKEN_SIGNATURE");
    res.send("Cookies cleared");
}

exports.user_create_get = function(req, res, next){
    res.send('Hidden: Create User');
}

exports.user_create_post = [
    body("username").trim().isLength({ min : 1})
        .escape().withMessage("Username required")
        .isAlphanumeric().withMessage("Username has non alphanumeric characters"),
    body("password").trim().isLength( {min : 1} )
        .escape().withMessage("Password required"),


    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            var err = new Error("Invalid Input");
            err.status = 409;
            return next(err);
        } else {
            var user = new User( {
                username : req.body.username, 
                password : req.body.password,
                notepad : ""
            });
            
            User.findOne( {username : req.body.username} )
                .exec(function(err, found_user) {
                    if(err) { return next(err); }

                    if(found_user){
                        var err = new Error("Username already exists");
                        err.status = 409;
                        return next(err);
                    } else {
                        bcrypt.genSalt(10, function(err, salt){
                            bcrypt.hash(user.password, salt, function(err, hash){
                                if(err) { return next(err); }

                                user.password = hash;
                                user.save(function(err) {
                                    if(err) { return next(err); }
                                    
                                    res.json({message : "good"});
                                });
                            })
                        });
                    }
                });
        }
    }

];

exports.user_delete_get = function(req, res, next){
    res.send('Hidden: Delete User');
}

exports.user_delete_post = function(req, res) {
    async.parallel({
        user : function(callback) {
            User.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }

        User.findByIdAndRemove(req.body.userid, function deleteUser(err){
            if(err) { return next(err); }

            res.json({message : "good"});
            // res.redirect("/api/users");
        });
    }
    );
}

exports.user_update_get = function(req, res, next){
    res.send('Hidden: Update User');
}

exports.user_update_post = [
    body("username").trim().isLength({min : 1}).escape().isAlphanumeric(),
    body("password").trim().isLength({min : 1}).escape(),
    body("notepad").trim(),

    (req, res, next) => {
        const errors = validationResult(req);

        User.findById(req.params.id)
            .exec((err, found_user) => {
                if(err) { return next(err); }

                var updated_user = new User(
                    {
                        username : req.body.username,
                        password : req.body.password,
                        notepad : found_user.notepad,
                        _id : req.params.id
                    }
                );
        
                if(!errors.isEmpty()){
                    var err = new Error("Invalid Input");
                    err.status = 409;
                    return next(err);
                } else {
                    User.findByIdAndUpdate(req.params.id, updated_user, {}, function(err, theuser){
                        if(err) { return next(err); }
        
                        // res.redirect(theuser.url);
                    });
                }
            });
    }
];

exports.user_notepad_update_post = [
    body("notepad").trim(),
    (req, res, next) => {
        const errors = validationResult(req);

        User.findById(req.params.id)
            .exec((err, found_user) => {
                if(err) { return next(err); }

                var updated_user = new User(
                    {
                        username : found_user.username,
                        password : found_user.password,
                        notepad : req.body.notepad,
                        _id : req.params.id
                    }
                );

                if(!errors.isEmpty()) {
                    var err = new Error("Invalid Input");
                    err.status = 409;
                    return next(err);
                } else {
                    User.findByIdAndUpdate(req.params.id, updated_user, {}, function(err, theuser){
                        if(err) { return next(err); }

                        // res.json({message : "success"});
                        // res.redirect(theuser.url);
                    });
                }
            })
    }
];

