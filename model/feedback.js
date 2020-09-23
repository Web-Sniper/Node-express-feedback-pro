const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
	name:{
		type : String,
		required : true
	},
	email:{
		type:String,
		required:true
	},
	mobile:{
		type:String,
		required:true
	},
	city:{
		type:String,
		required:true
	},
	feedback:{
		type:String,
		required:true
	}
})

mongoose.model("Feedback",feedbackSchema)