import React,{Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form,Grid,Container,Header,Segment } from 'semantic-ui-react'


/*
	Send user details to server.
	Form validation
	Indicate fields as mandatory.
*/

export default class RegisterUser extends Component {

	constructor(props){
		super(props)		
		this.state = {
			firstName : "",
			lastName : "",
			userid : "",
			password : "",
			confPassword : "",
			email:String
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event){
		const target = event.target
		const name = target.name
		const value = target.value

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
			body:JSON.stringify(this.state)
		}).then(function(resut){
			console.log('success for registerUser');
		},function(error){
			console.log('error for registerUser');
		});
	}

	render(){
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
						            <Form.Input label="First Name:" type="text" placeholder="First name" name="firstName" onChange={this.handleChange}/> 
						            <Form.Input label="Last Name:" type="text" placeholder="Last name" name="lastName" onChange={this.handleChange}/>
						          </Form.Group>
						          <Form.Input label="Choose your id:" type="text" name="userid" onChange={this.handleChange}/>

						          <Form.Input label='Enter Password:' name="password" type='password' onChange={this.handleChange}/>
						          <Form.Input label='Confirm Password:' name="confPassword" type='password' onChange={this.handleChange}/>
						           <Form.Input label='Email:' name="email" type='email' onChange={this.handleChange}/>
						          <Form.Button>Register Now</Form.Button>
						        </Form>

					      </Grid.Column>
					    </Grid.Row>
				    </Grid>
				</Container>
			</div>
			);
	}
}