import React,{Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form,Grid,Container,Header,Segment,Message } from 'semantic-ui-react'


export default class RegisterUser extends Component {

	constructor(props){
		super(props)		
		this.state = {
			firstName : "",
			isFirstNameValid:false,
			lastName : "",
			isLastNameValid:false,
			userid : "",
			isUserIdValid:false,
			password : "",
			isPasswordValid:false,
			confPassword : "",
			isPasswordConfirmed:true,
			email:""
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event){
		const target = event.target
		const name = target.name
		const value = target.value

		if(name === 'firstName'){
			if(value.length < 2){
				this.state.isFirstNameValid = false;
			}else{
				this.state.isFirstNameValid = true;
			}
		}
		
		if(name === 'lastName'){
			if(value.length < 2){
				this.state.isLastNameValid = false;
			}else{
				this.state.isLastNameValid = true;
			}
		}
		
		if(name === 'userid'){
			if(value.length < 8){
				this.state.isUserIdValid = false;
			}else{
				this.state.isUserIdValid = true;
			}
		}
		if(name === 'password'){
			if(value.length < 8){
				this.state.isPasswordValid = false;
			}else{
				this.state.isPasswordValid = true;
			}
		}
		if(name === 'confPassword'){
			if( value === this.state.password){
				this.state.isPasswordConfirmed = true;
			}else{
				this.state.isPasswordConfirmed = false;
			}
		}
		this.setState({
			[name]:value
		})
	}

	handleSubmit(event){
		fetch('/registerUser',{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify({
				firstName : this.state.firstName,
				lastName : this.state.lastName,
				userid : this.state.userid,
				password : this.state.password,
				email:this.state.email
			})
		}).then(function(resut){
			console.log('success for registerUser');
		},function(error){
			console.log('error for registerUser');
		});
	}

	render(){

		const isFormValid = (this.state.isFirstNameValid && this.state.isLastNameValid && 
							this.state.isUserIdValid && this.state.isPasswordValid && this.state.isPasswordConfirmed );
  
		return (
			<div>
				<Container fluid textAlign='justified'>
					<Header>Register User</Header>
					<Grid columns={2} divided stackable>
						<Grid.Row>
						  <Grid.Column>
						  </Grid.Column>
						  <Grid.Column width={7}>
						        <Form size={'large'} key={'large'} onSubmit={this.handleSubmit}>
						          <Form.Group>
						            <Form.Input required label="First Name:" type="text" placeholder="First name" name="firstName" onChange={this.handleChange}/> 
									{!this.state.isFirstNameValid?<Message content='Minimum 2 chars length.'/>:<p></p>}
						            <Form.Input required label="Last Name:" type="text" placeholder="Last name" name="lastName" onChange={this.handleChange}/>
									{!this.state.isLastNameValid?<Message content='Minimum 2 chars lenght.'/>:<p></p>}
						          </Form.Group>
						          <Form.Input required label="Choose your id:" type="text" name="userid" onChange={this.handleChange}/>
								  {!this.state.isUserIdValid?<Message content='Id should be of minimum 8 chars length.'/>:<p></p>}
								  
						          <Form.Input required label='Enter Password:' name="password" type='password' onChange={this.handleChange}/>
								  {!this.state.isPasswordValid?<Message content='Password should be of minimum 8 chars length.'/>:<p></p>}
						          <Form.Input required label='Confirm Password:' name="confPassword" type='password' onChange={this.handleChange}/>
								  {!this.state.isPasswordConfirmed?<Message content="Password doesn't match."/>:<p></p>}
						          <Form.Input label='Email:' name="email" type='email' onChange={this.handleChange}/>
						          <Form.Button disabled={!isFormValid}>Register Now</Form.Button>
						        </Form>

					      </Grid.Column>
					    </Grid.Row>
				    </Grid>
				</Container>
			</div>
			);
	}
}