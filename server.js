const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express()
const router = express.Router()

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(cookieParser());

//connect to db server
mongoose.connect('mongodb://localhost/myBlog');

class BaseServices {
	constructor(){
		this.schema = mongoose.Schema;
		//this.success = { resultCode : 0, resultMessage : 'success' }
		//this.error = { resultCode : -1, resultMessage : 'error' }
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
		var self = this;
		var newUser = new this.model(req.body);
		console.log(JSON.stringify(newUser));
		this.model.findOne({userid:newUser.userid},'password',function(err,user){
			if(err) {
				//handle error
				console.log('handle error case');
				return res.status(200).send({ resultCode : -1, resultMessage : "Error" });
			}
			if(user != null){
				console.log("User Id already exists");
				res.send({ resultCode : -1, resultMessage : "User Id Already exists" });
				console.log("after user sends response");
			}else{
				console.log('user id doesnt exist');
				newUser.save()
				.then(item => {
					res.status(200).send({ resultCode : 0, resultMessage : "Success" });
				})
				.catch(err => {
					res.status(200).send({ resultCode : -1, resultMessage : "Error" });
				});
			}
		}).catch(error => {
			console.log(error);
		})

	}
	
	isAuthenticationRequired(req,res){
		
		if(!req.cookies){
			console.log('did not receive any cookies with request');
			return res.send({ auth: false, message: 'No token provided.' });
		}
		
		console.log("cookies "+req.cookies.authToken);
		
		const authToken = req.cookies.authToken;
		
		if (!authToken){
			console.log('did not receive token');
			return res.status(200).send({ auth: false, message: 'No token provided.' });
		}
  
		jwt.verify(authToken, 'tempSec', function(err, decoded) {
			if (err) {
				console.log('error occured while verify authToken');
				return res.status(200).send({ auth: false, message: 'Failed to authenticate token.' });
			}
			console.log("userid from Token : "+decoded.id);
			res.status(200).send({ auth: true, userid:decoded.id });
		});
		
		
	}
	
	//Return userid if user has a valid cookie else null

	
	authenticateUser(req,res){
		var userToAuthenticate = new this.model(req.body);
		console.log(userToAuthenticate);
		var self = this;
		
		//Query for userid
		this.model.findOne({userid:userToAuthenticate.userid},'password',function(err,user){
			if(err) {
				//handle error
				console.log('handle error case');
				res.send({ resultCode : -1, resultMessage : 'error' });
				return;
			}
			
			if(user != null){
				console.log(JSON.stringify(user));
				if(user.password === userToAuthenticate.password){
					//Generate auth Token to set on the client.
					var token = jwt.sign({ id:userToAuthenticate.userid }, 'tempSec', {
						expiresIn: 86400 // expires in 24 hours
					});
					res.cookie('authToken', token, {domain:'pathiyugandhar.com' });
					res.send( { resultCode : 0, resultMessage : 'success' });
				}else{
					console.log("password doesn't match");
					res.send({ resultCode : -1, resultMessage : "UserId or Password doesn't match" });
				}
			}else{
				console.log('user id doesnt exist');
				res.send({ resultCode : -1, resultMessage : "UserId or Password doesn't match" });
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
							date : String
						});
						
		this.commentSchema = new this.schema({
			comment : String,
			blogId : String,
			date : String,
			author : String
		});
						
		this.model = mongoose.model("Blog",this.blogSchema);
		this.commentsModel =  mongoose.model("Comments",this.commentSchema);
	}
	
	postBlog(req,res){
		var blogToSave = new this.model(req.body);
		blogToSave.date = (new Date()).toDateString()

		console.log('blog data from client '+JSON.stringify(blogToSave));
		
		blogToSave.save()
		.then(item => {
			res.send( { resultCode : 0, resultMessage : 'success' });
		})
		.catch(err => {
			res.send({ resultCode : -1, resultMessage : "error" });
		});

	}
	
	fetchBlog(req,res,blogId){
		const query = this.model.findOne({_id:blogId});
		const blogServices = this;
		query.select('_id title body author date');

		// execute the query
		query.exec(function (err,blogDetails) {
			if (err){
				console.log('error occured');
				return;// handleError(err); @TODO
			}
			//fill the query
			var success = { resultCode : 0, resultMessage : 'success' };
			success.blog = blogDetails;
			//fetch comments for this blogId
			const commentsQuery = blogServices.commentsModel.find({blogId:blogId});
			commentsQuery.select('comment date author');
			commentsQuery.exec(function (err,comments) {
				if (err){
					console.log('postComment error occured');
					res.send({ resultCode : -1, resultMessage : "error" });
				}
				//fill the query
				if(comments){
					success.comments = comments;
				}else{
					success.comments = [];
				}
				
				console.log('List of comments '+JSON.stringify(comments));
				res.send(success);
			});
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
			var success = { resultCode : 0, resultMessage : 'success' };
			success.items = items;
			console.log('List of blogs '+JSON.stringify(items));
			res.send(success);
		});
	}
	
	getUserIdFromCookie(req,res){
		var userIdToken = null;
		if(!req.cookies){
			console.log('did not receive any cookies with request');
			return null;
		}
		
		console.log("cookies "+req.cookies.authToken);
		
		const authToken = req.cookies.authToken;
		
		if (!authToken){
			console.log('did not receive token');
			return null;
		}
  
		jwt.verify(authToken, 'tempSec', function(err, decoded) {
			if (err) {
				console.log('error occured while verify authToken');
				return null;
			}
			console.log("userid from Token : "+decoded.id);
			userIdToken = decoded.id;
		});
		return userIdToken;
	}
	
	
	postComment(req,res){
		const commentToSave = new this.commentsModel(req.body);
		const blogServices = this;
		//fetch author from cookie
		const userid = this.getUserIdFromCookie(req);
		console.log(userid);
		if(userid){
			console.log("Comment to post "+commentToSave);
			commentToSave.author = userid;
			commentToSave.save()
			.then(item => {
				//Query for comments Model
				const query = blogServices.commentsModel.find({blogId:commentToSave.blogId});
				query.select('comment date author');

				// execute the query
				query.exec(function (err,comments) {
					if (err){
						console.log('postComment error occured');
						res.send({ resultCode : -1, resultMessage : "error" });
					}
					//fill the query
					var success = { resultCode : 0, resultMessage : 'success' };
					if(comments){
						success.comments = comments;
					}else{
						success.comments = [];
					}
					
					console.log('List of comments '+JSON.stringify(comments));
					res.send(success);
				});
			})
			.catch(err => {
				res.send({ resultCode : -1, resultMessage : "error" });
			});
		}else{
			//Tell client that user has to login
			res.send({ resultCode : -1, resultMessage : "error" });
		}
		
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

app.post('/postComment', function(req, res){
	blogServices.postComment(req,res);
});

app.listen(80, () => console.log('Example app listening on port 80!'))