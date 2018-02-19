import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu,Modal,Button,Form } from 'semantic-ui-react'

import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";

import RegisterUser from './RegisterUser.js'
import HomePage from './HomePage.js'
import PostBlog from './PostBlog.js'



class App extends Component {
	
	constructor(props){
		super(props);
		this.state = { modalOpen:false,userid:'',password:'',endPointResult:0,errorMessage:'',navigateToPostBlog:false };

		this.handleModelOpen = this.handleModelOpen.bind(this);
		this.handleModelClose = this.handleModelClose.bind(this);

		this.handleUserCredChange = this.handleUserCredChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);


		this.SUCCESS = 0; // end point sent success
		this.ERROR = -1; //end point sent error message
	}

	handleItemClick(event){
		const target = event.target;
		if(target.name === 'PostBlog'){

			
		}
	}
  
	handleModelOpen(){
		this.setState({ modalOpen:true,
						endPointResult:0 //Hide userid doesn't match message	
						});  
	}

	handleModelClose(){
		this.setState({ modalOpen:false });
	}

	handleLogin(){
		var myApp = this;
		fetch('/authUser',{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify(this.state)
		}).then(res => res.json())
		  .then(function(result){
				console.log('Result for authUser '+JSON.stringify(result));
				if(result.resultCode === myApp.SUCCESS){
					//Navigate to post a blog page -- navigateToPostBlog
					myApp.setState({
						navigateToPostBlog:true
					})
				}
				if(result.resultCode === myApp.ERROR){
					myApp.setState({
						endPointResult:result.resultCode,
						errorMessage :result.resultMessage
					})
				}
			},function(error){
				console.log('error occured in auth user'+error);
				
			});
	}
  
	handleUserCredChange(event){
		const target = event.target
		const name = target.name
		const value = target.value

		this.setState({
			[name]:value,
			endPointResult:0 //Hide user id doesn't match message
		})
	}

	render() {
		const authResult = this.state.endPointResult;
		console.log('endPointResult '+authResult);
		
		if(this.state.navigateToPostBlog){
			return <Route path="/PostBlog" component={PostBlog}/>
		}
		
		return (
			<HashRouter>
				<div>
					<Menu secondary>
						<Menu.Item name='TechBlogs'><NavLink to="/">Pathi Yugandhar's Tech Blogs</NavLink></Menu.Item>
						<Menu.Menu position='right'>
							<Modal fluid closeOnDocumentClick trigger={<Button onClick={this.handleModelOpen}>Post Blog</Button>}
								open={this.state.modalOpen}
								onClose={this.handleModelClose}
								size='small'>
								<Modal.Header>SignIn</Modal.Header>
								<Modal.Content>
									<Modal.Description>
										<Form onSubmit={this.handleSubmit}>
										  <Form.Input label="User id:" type="text" name="userid" onChange={this.handleUserCredChange}/>
										  <Form.Input label='Password:' name="password" type='password' onChange={this.handleUserCredChange}/>
										  <Form.Button onClick={this.handleLogin}>Login</Form.Button>
										</Form>
										{authResult === this.ERROR ? <p>{this.state.errorMessage}</p>:<p></p>}
										<NavLink onClick={this.handleModelClose} to="/RegisterUser">Not an User?Register Now.</NavLink>
									</Modal.Description>
								</Modal.Content>
							</Modal>
						</Menu.Menu>
					</Menu>
					<div className="content">
						<Route exact path="/" component={HomePage}/>
						<Route path="/RegisterUser" component={RegisterUser}/>
						<Route path="/PostBlog" component={PostBlog}/>
					</div>
				</div>
			</HashRouter>

			);
		}
	}

export default App;

