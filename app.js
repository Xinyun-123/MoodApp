const db = require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Mood = mongoose.model('Mood');
const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'add session secret here',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');
app.get('/', (req, res)=>{
    res.render('home',{username: req.session.username, home: true});
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if (!err && user) {
            bcrypt.compare(req.body.password, user.password, (err, passwordMatch) => {
                if (passwordMatch){
                    req.session.regenerate((err) => {
                        if (!err) {
                            req.session.username = user.username; 
                            res.redirect('/');
                        } else {
                            console.log('error'); 
                            res.send('an error occurred, please see the server logs for more information');
                        }
                    });
                }else{
                    const message = '<span class="error">incorrect pw</span>';
                    res.render('error',{message});
                }
            });
        }else {
            const message = '<span class="error">user not exist</span>';
            res.render('error',{message});
        }
    });
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
    if (req.body.password.length<8){
        const message = '<span class="error">password length is too short</span>';
        res.render('error',{message});
    }else{
        User.findOne({username: req.body.username},(err, result) => {
            if(result){
                const message = '<span class="error">user already exists</span>';
                res.render('error',{message});
            }else{
                bcrypt.hash(req.body.password, 8, function(err, hash) {
                    new User({
                        username: req.body.username,
                        password: hash,
                    }).save(function(err, user){
                        req.session.regenerate((err) => {
                            if (!err) {
                                req.session.username = user.username; 
                                res.redirect('/');
                            } else {
                                console.log('error'); 
                                res.send('an error occurred, please see the server logs for more information');
                            }
                        });
                    });            
                });
            }
        });
       
    }
});


app.get('/addMood', (req, res) => {
    res.render('add',{username: req.session.username, home: true});
});

app.get('/deleteMood', (req, res) => {
	Mood.find({user: req.session.username}, function(err, varToStoreResult) {
        res.render('delete', {"moods":varToStoreResult, username: req.session.username, home: true});
    });
});

app.post('/deleteMood', (req,res)=>{
	Mood.deleteOne({ createdAt: req.body.createdAt }, function (err) {
		if (err) return handleError(err);
		res.redirect('/historyMood');
	});
});

app.post('/addMood', (req, res) =>{
	new Mood({
		user: req.session.username,
		mtype: req.body.mtype,
		note: req.body.note,
		createdAt: req.body.createdAt
	}).save(function(err, user){
		if (!err) {
			res.redirect('/');
		} else {
			console.log('error'); 
			console.log(err);
			res.send('an error occurred, please see the server logs for more information');
		}
	});
});

app.get('/historyMood',(req,res) => {
	Mood.find({user: req.session.username}, function(err, varToStoreResult) {
        res.render('history', {"moods":varToStoreResult, username: req.session.username, home: true});
    });
});

app.get('/historyMood/moodStats',(req,res) => {
	Mood.find({user: req.session.username}, function(err, varToStoreResult) {
		const week = varToStoreResult.filter(function(element) {
			var dt1 = element.createdAt;
			var dt2 = new Date();
			dt1 = new Date(dt1);
			let res = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
			return res<7;
		});
		const month = varToStoreResult.filter(function(element) {
			var dt1 = element.createdAt;
			var dt2 = new Date();
			dt1 = new Date(dt1);
			let res = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
			return res<=30;
		});

		const weekStat = week.reduce((count,cur)=>{
			count[cur.mtype]++;
			return count;
		},{'Awesome':0, 'Good':0, 'Okay':0,'Bad':0,'Terrible':0});

		const monthStat = month.reduce((count,cur)=>{
			count[cur.mtype]++;
			return count;
		},{'Awesome':0, 'Good':0, 'Okay':0,'Bad':0,'Terrible':0});
		res.render('stats', {"week":weekStat, "month":monthStat, username: req.session.username, home: true});
	});

});

app.get('/historyMood/feedback',(req,res) => {
	Mood.find({user: req.session.username}, function(err, varToStoreResult) {
        res.render('feedback', {"moods":varToStoreResult, username: req.session.username, home: true});
    });
});

app.post('/historyMood/feedback',(req,res) => {
	Mood.updateOne(
		{ "createdAt": req.body.createdAt,"user": req.session.username },
		{ $set: {"feedback": req.body.feedback} },
		function(err, item) {
			if (err) throw err;
			console.log("1 document updated",item);
			res.redirect("/historyMood");
		}
	);

});

app.listen(process.env.PORT || 3000, function() {
});

