import React,{Component} from 'react'
import { Menu,Modal,Container,Button,Form } from 'semantic-ui-react'

import {
  Route,
  NavLink,
  BrowserRouter
} from 'react-router-dom';

export default class Login extends Component {
	constructor(props){
		super(props);
		this.state = { userid:'',
		               password:'',
					   endPointResult:0,
					   errorMessage:'',
					   userCredsNotFilled:false
					};

		this.handleUserCredChange = this.handleUserCredChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);


		this.SUCCESS = 0; // end point sent success
		this.ERROR = -1; //end point sent error message
		this.LENGTHZERO = 0;

	}

	handleLogin(){
		
		if(this.state.userid.length === this.LENGTHZERO || 
			this.state.password.length === this.LENGTHZERO){
			this.setState({
				userCredsNotFilled : true,
				errorMessage : "UserName or Password can't be empty"
			});
			return;
		}
		
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
					//Navigate to post a blog page -- navigateToPostBlog - @TODO
					myApp.props.history.push("/PostBlog");
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
			endPointResult:0, //Hide user id doesn't match message
			userCredsNotFilled : false
		})
	}


	render(){
		return (
			<Container>
				<Form onSubmit={this.handleSubmit}>
					<Form.Input label="User id:" type="text" name="userid" onChange={this.handleUserCredChange}/>
					<Form.Input label='Password:' name="password" type='password' onChange={this.handleUserCredChange}/>
					<Form.Button onClick={this.handleLogin}>Login</Form.Button>
				</Form>
				{this.state.endPointResult === this.ERROR ? <p>{this.state.errorMessage}</p>:<p></p>}
				{this.state.userCredsNotFilled ? <p>{this.state.errorMessage}</p>:<p></p>}
				<NavLink onClick={this.handleModelClose} to="/RegisterUser">Not an User?Register Now.</NavLink>
			</Container>

			)

	}


}