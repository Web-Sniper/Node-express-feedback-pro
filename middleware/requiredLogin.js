const jwt = require("jsonwebtoken")
const {JWT_SECRATE} = require("../keys")
const mongoose = require("mongoose")
const User = mongoose.model("User")


module.exports = (req,res,next)=>{
    var {authorization} = req.headers
    if(!authorization){
        res.render("signin.ejs")
        return res.status(422).json("Please login first.....")
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRATE,(err,payload)=>{
        if(err){
            return res.status(401).json({"err" : "Please login first"})
        }
        const {_id} = payload
        User.findById(_id).then(userData=>{
            req.user = userData
            next()
        })
        next()
    })
}