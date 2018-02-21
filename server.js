const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express()
const router = express.Router()

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

//connect to db server
mongoose.connect('mongodb://localhost/myBlog');

class BaseServices {
	constructor(){
		this.schema = mongoose.Schema;
		this.success = { resultCode : 0, resultMessage : 'success' }
		this.error = { resultCode : -1, resultMessage : 'error' }
	}
}

class AuthServices extends BaseServices {
	constructor(){
		super();
		this.userDetailsSchema = new this.schema({
									firstName: String,
									lastName : String,
									userid : String,
									password : String,
									email : String
								});
		this.model = mongoose.model("User",this.userDetailsSchema);
	}
	
	registerUser(req,res){
		console.log("Begin registerUser"+JSON.stringify(req.body));
		var newUser = new this.model(req.body);
		console.log(JSON.stringify(newUser));
		newUser.save()
		.then(item => {
			res.send(this.success);
		})
		.catch(err => {
			//res.send(error);
		});
	}
	
	isAuthenticationRequired(req,res){
		if(!req.cookies){
			console.log('did not receive any cookies with request');
			return res.send(this.error);
		}
		
		if (!authTicket){
			console.log('did not receive token');
			return res.status(401).send({ auth: false, message: 'No token provided.' });
		}
  
		jwt.verify(token, tempSec, function(err, decoded) {
			if (err) 
				return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
		});
		
		res.status(200).send(decoded);
	}
	
	authenticateUser(req,res){
		var userToAuthenticate = new this.model(req.body);
		console.log(userToAuthenticate);
		var self = this;
		
		//Query for userid
		this.model.findOne({userid:userToAuthenticate.userid},'password',function(err,user){
			if(err) {
				//handle error
				console.log('handle error case');
				res.send(self.error);
				return;
			}
			
			if(user != null){
				console.log(JSON.stringify(user));
				if(user.password === userToAuthenticate.password){
					var token = jwt.sign({ id:userToAuthenticate.userid }, 'tempSec', {
						expiresIn: 86400 // expires in 24 hours
					});
					res.cookie('authToken', token, {domain:'pathiyugandhar.com',maxAge:86400000 });
					res.send(self.success);
				}else{
					console.log("password doesn't match");
					self.error.resultMessage = "UserId or Password doesn't match";
					res.send(self.error);
				}
			}else{
				console.log('user id doesnt exist');
				self.error.resultMessage = "UserId or Password doesn't match";
				res.send(self.error);
			}
		});
	}
}

class BlogServices extends BaseServices {
	constructor(){
		super()
		this.blogSchema = new this.schema({
							author : String,
							title : String,
							body : String,
							date : Date
						});
						
		this.model = mongoose.model("Blog",this.blogSchema);
	}
	
	postBlog(req,res){
		var blogToSave = new this.model(req.body);
		console.log('blog data from client '+JSON.stringify(blogToSave));
		
		blogToSave.save()
		.then(item => {
			res.send(this.success);
		})
		.catch(err => {
			//res.send(error);
		});

	}
	
	fetchBlog(req,res,blogId){
		const query = this.model.findOne({_id:blogId});
		//console.log(query)
		query.select('_id title body author date');
		
		var self = this;
		// execute the query
		query.exec(function (err,blogDetails) {
			if (err){
				console.log('error occured');
				return;// handleError(err); @TODO
			}
			//fill the query
			self.success.item = blogDetails;
			console.log('Blog Detials '+JSON.stringify(blogDetails));
			res.send(self.success);
		});
	}
	
	fetchBlogList(req,res){
		const query = this.model.find();
		// selecting id,title and author for each blog
		query.select('_id title author date');
		
		var self = this;
		// execute the query
		query.exec(function (err, items) {
			if (err){
				console.log('error occured');
				return;// handleError(err); @TODO
			}
			//fill the query
			self.success.items = items;
			console.log('List of blogs '+JSON.stringify(items));
			res.send(self.success);
		});
	}
}



app.get('/', function(req, res){
  res.render('index.html');
});

//End points for auth services
const authSerivces = new AuthServices();
app.post('/registerUser', function(req, res){
	authSerivces.registerUser(req,res);
});

app.post('/authUser', function(req, res){
	authSerivces.authenticateUser(req,res);
});

app.get('/isAuthenticationRequired', function(req, res){
	authSerivces.isAuthenticationRequired(req,res);
});

//Blog end points
const blogServices = new BlogServices();
app.post('/postBlog', function(req, res){
	console.log('received blog to save');
	blogServices.postBlog(req,res);
});

app.get('/fetchBlog/:id', function(req, res){
	console.log("Blog id"+req.params.id);
	blogServices.fetchBlog(req,res,req.params.id);
});

app.get('/fetchBlogList', function(req, res){
	blogServices.fetchBlogList(req,res);
});

app.listen(80, () => console.log('Example app listening on port 80!'))