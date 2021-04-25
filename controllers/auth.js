const { validationResult } = require("express-validator")
const User = require("../models/user")
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
require("dotenv").config()



exports.signup = (req,res)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }


     const user = new User(req.body)
    user.save((err,user)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                err:"Not able to save user in DB"
            })
        }
        res.json({
            name:user.id,
            email:user.email,
            id:user._id,
            salt:user.salt //Salt is not send

        });
    })
}
exports.signin =(req,res)=>{
    //Check here for error 
    const errors = validationResult(req)

    const {email,password} =req.body
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    User.findOne({email},(err,user)=>{
        if(!errors.isEmpty() || !user){
          return  res.status(422).json({
                error: "User Does not exist"
            })
        }
        if(!user.authenticate(password)){
            return res.status(422).json({
                error: "Email and password do not match"
            })
        }
        //create token
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        //Put token in cookie
        res.cookie("token",token,{expire:new Date()+9999});
        //Send res to frontend
        const {_id,name,email,role}=user;
        return res.json({token,user:{_id,name,email,role}})

    })
}

exports.signout = (req,res)=>{
    res.clearCookie("token")
    res.json({
        message:"User Signout Successfully"
    })
}

//Protected routes

exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
})

//custom middlewares

exports.isAuthenticated = (req,res,next) =>{
    //profile to be set up from front end

    let checker = req.profile && req.auth && (req.profile._id == req.auth._id)
    if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        })
    } 
    next()
}

exports.isAdmin = (req,res,next) =>{
    if(req.profile.role === 0 ){
        return res.status(403).json({
            error:"Admin only access, Access denied"
        })
    }
    next()
}