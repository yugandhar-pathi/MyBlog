import React,{Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form,Grid,Container,Header,Segment,Message } from 'semantic-ui-react'


export default class RegisterUser extends Component {

	constructor(props){
		super(props)		
		this.state = {
			firstName : "",
			lastName : "",
			isNameValid:false,
			userid : "",
			isUserIdValid:false,
			password : "",
			isPasswordValid:false,
			confPassword : "",
			isPasswordConfirmed:true,
			email:"",
			formSubmissionFailed:false,
			formSubmissionMessage:''
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	
	/*
		Handle form validation on each char input.
	*/
	handleChange(event){
		const target = event.target;
		const name = target.name;
		const value = target.value;
		const isValidField = '';

		var isValid = false;
		if(name === 'firstName' || name === 'lastName'){
			if(value.length < 2){
				isValid = false;
			}else{
				isValid = true;
			}
			this.setState({
				[name]:value,
				isNameValid : isValid
			})
			return false;
		}
		
		if(name === 'userid' || name === 'password'){
			if(value.length < 8){
				isValid = false;
			}else{
				isValid = true;
			}
			const validField = name === 'userid' ? 'isUserIdValid' : 'isPasswordValid'
			this.setState({
				[name]:value,
				[validField] : isValid
			})
			return false;
		}

		if(name === 'confPassword'){
			if( value === this.state.password){
				isValid = true;
			}else{
				isValid = false;
			}
			this.setState({
				[name]:value,
				isPasswordConfirmed : isValid
			})
		}
	}

	handleSubmit(event){
		var form = this;
		fetch('/registerUser',{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify({
				firstName : form.state.firstName,
				lastName : form.state.lastName,
				userid : form.state.userid,
				password : form.state.password,
				email:form.state.email
			})
		}).then(res => res.json())
		  .then(function(result){
			if(result.resultCode === 0){
				console.log('success for registerUser');
				form.props.history.push('/Login');
			}else{
				form.setState({
					formSubmissionFailed : true,
					formSubmissionMessage : result.resultMessage
				});
			}
		},function(error){
			console.log('error for registerUser');
			form.setState({
				formSubmissionFailed : true,
				formSubmissionMessage : error.resultMessage
			});
		});
	}

	render(){

		const isFormValid = (this.state.isNameValid && 
							this.state.isUserIdValid && this.state.isPasswordValid && this.state.isPasswordConfirmed );
  
		return (
			<div>
				<Container>
					<Container textAlign='justified'>
						<Header>Register User</Header>
						<Form size={'large'} key={'large'} onSubmit={this.handleSubmit}>
						  <Form.Group>
							<Form.Input required label="First Name:" placeholder="Min 2 chars" type="text" name="firstName" onChange={this.handleChange}/> 
							<Form.Input required label="Last Name:" type="text" placeholder="Min 2 chars" name="lastName" onChange={this.handleChange}/>
						  </Form.Group>
						  {!this.state.isNameValid?<Message content='First or Last name should be of min 2 chars length.'/>:<p></p>}
						  <Form.Input required label="Choose your id:" type="text" name="userid" onChange={this.handleChange}/>
						  {!this.state.isUserIdValid?<Message content='Id should be of minimum 8 chars length.'/>:<p></p>}
						  
						  <Form.Input required label='Enter Password:' name="password" type='password' onChange={this.handleChange}/>
						  {!this.state.isPasswordValid?<Message content='Password should be of minimum 8 chars length.'/>:<p></p>}
						  <Form.Input required label='Confirm Password:' name="confPassword" type='password' onChange={this.handleChange}/>
						  {!this.state.isPasswordConfirmed?<Message content="Password doesn't match."/>:<p></p>}
						  <Form.Input label='Email:' name="email" type='email' onChange={this.handleChange}/>
						  <Form.Button disabled={!isFormValid}>Register Now</Form.Button>
						  {this.state.formSubmissionFailed ?<Message header='Submission Failed' content={this.state.formSubmissionMessage}/> : <p></p> }
						</Form>

					</Container>
				</Container>
			</div>
			);
	}
}