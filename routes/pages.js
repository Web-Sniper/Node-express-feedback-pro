var express = require("express")
var router = express.Router()
var mongoose = require('mongoose');
var Feedback = mongoose.model("Feedback")
var User = mongoose.model("User")
var bcrypt = require("bcrypt")
var {JWT_SECRATE} = require("../keys")
var jwt = require("jsonwebtoken");
const requiredLogin = require("../middleware/requiredLogin");
var {LocalStorage} = require("node-localstorage");
const { render } = require("ejs");
localStorage = new LocalStorage('./scratch')

//get functions
router.get('/',function(req,res){
	res.render('index.ejs');
});
router.get('/feedback',requiredLogin,function(req,res){
	
	res.render('feedback.ejs');
});
router.get('/home',function(req,res){
	res.render('index.ejs');
});


//post functions

//feedback
router.post('/feedback',requiredLogin,function(req,res){
	const {name,email,mobile,city,feedback} = req.body
	if(!name||!email||!mobile||!city||!feedback){
		return res.status(422).json({"Err" : "All field is mandatory"})
	}
	const comments = new Feedback({
		name,
		email,
		mobile,
		city,
		feedback
	})
	comments.save()
	.then((user)=>{
		res.json({"message" : "Data Saved...."})
	})
	.catch(err=>{
		console.log({err})
	})
})
router.get('/showDetails',function(req,res){
	Feedback.find(function(err,data){
		if(err)
		res.send(err);
		else
		res.send(data);
	})
})

//signup
router.post('/signup',function(req,res){
	var {email,password} = req.body
	if(!email||!password){
		return res.status(422).json({"message" : "Fill all the details..."})
	}
	User.findOne({email:email})
	.then((savedUser)=>{
		if(savedUser){
			return res.status(422).json({"err" : "User already exist...."})
		}
		bcrypt.hash(password,12,(err,hash)=>{
			password = hash
			const user = new User({
				email,
				password
			})
			user.save()
			.then(user=>{
				res.json("SignedUp Successfully....")
			})
			.catch(err=>{
				console.log(err)
			})
		})
		
	})

})


//signin
router.post('/signin',(req,res)=>{
	const {email,password} = req.body
	User.findOne({email:email})
	.then((user)=>{
		if(!user){
			return res.status(422).json({"err" : "User or Password is incorrect...."})
		}
		bcrypt.compare(password,user.password)
		.then(doMatch=>{
			if(doMatch){
				const token = jwt.sign({_id:user._id},JWT_SECRATE)
				localStorage.setItem("jwt",token)
				//res.set("Authorization", localStorage.getItem("jwt"))
				//res.json({"message" : "Successfully Logged in....", "token" : localStorage.getItem("jwt")})
				return res.redirect("/")
			}
			else{
				return res.status(422).json({"err" : "User or Password is incorrect...."})
			}
		})
		.catch(err=>{
			console.log(err)
		})
	})
	.catch(err=>{
		console.log(err)
	})
})

router.get("/signin",(req,res)=>{
	res.render("signin.ejs")
})

module.exports = router