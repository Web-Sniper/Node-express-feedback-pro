var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var bp = require('body-parser');
var app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended : true}))
const {MONGOURI} = require("./keys");
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB...")
})
mongoose.connection.on('error',(err)=>{
    console.log("Error", err)
})

require("./model/feedback")
require("./model/user")
app.use(require("./routes/pages"))

app.listen(2001);
console.log("Server Started......");