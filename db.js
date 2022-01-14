// db.js
const mongoose = require('mongoose');
require("dotenv").config();
// const uri = process.env.MONGODB_URI;
// mongoose.connect(uri);
// my schema goes here!
const User = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
});
mongoose.model('User', User);

const Mood = new mongoose.Schema({
	user: String,
	mtype: {type: String, enum: ['Awesome', 'Good', 'Okay','Bad','Terrible'], required: true},
	note: {type: String, default:''},
	createdAt: {type: String, required: true},
	feedback: {type: String, default:''},
});
mongoose.model('Mood', Mood);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;

if (process.env.NODE_ENV === 'PRODUCTION') {
// if (true){
	// const fs = require('fs');
	// const path = require('path');
	// const fn = path.join(__dirname, 'config.json');
	// const data = fs.readFileSync(fn);
	// const conf = JSON.parse(data);
	// dbconf = conf.dbconf;
	// console.log(dbconf);
	console.log('listen 1');
	dbconf = process.env.MONGODB_URI;
} else {
	// if we're not in PRODUCTION mode, then use
	console.log("listen 2");
	dbconf = 'mongodb://localhost/final_proj';
}
// console.log(dbconf);
// mongodb+srv://admin-xinyun:xinyuntest@cluster0.5umnh.mongodb.net/final_proj
// mongoose.connect('mongodb://localhost/final_proj');
mongoose.connect(dbconf,{useNewUrlParser: true});