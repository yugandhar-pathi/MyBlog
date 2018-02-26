import React, { Component } from 'react';
import { Container,Form,TextArea } from 'semantic-ui-react'

/*
	Integrate service to upload blog contents.
*/

export default class HomePage extends Component {

	constructor(props){
		super(props);
		this.state = { author : '', title : '', body : '', date : '',blogDetailsNotFilled:false };
		this.handleChange = this.handleChange.bind(this);
		this.postBlog = this.postBlog.bind(this);
	}
	
	handleChange(event){
		const target = event.target
		const name = target.name
		const value = target.value

		this.setState({
			[name]:value,
			blogDetailsNotFilled:false
		})
	}
	
	postBlog(event){
		
		var myApp = this;
		var title = this.state.title.trim();
		var body = this.state.body.trim();
		if(title.length ==0 || body.length === 0){
			this.setState({
				blogDetailsNotFilled:true,
				title:title,
				body:body
			})
			return;
		}
		
		fetch('/postBlog',{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify({ 	author : myApp.props.match.params.UserId, 
									title : myApp.state.title, 
									body : myApp.state.body 
								})
		}).then(function(resut){
			console.log('success for postBlog');
			myApp.props.history.push("/");
		},function(error){
			console.log('error for postBlog');
		});
	}

	render(){
		return(
				<div>
					<Container textAlign="justified">
						<Form>
							<Form.Input label='Title:' name='title' type="text" onChange={this.handleChange}/>
							<Form.Field control={TextArea} name='body' label="Description:"  onChange={this.handleChange} style={{ minHeight: 500 }} placeholder='Start writing ...' />
							<Form.Button onClick={this.postBlog}>Post Now</Form.Button>
							{this.state.blogDetailsNotFilled ? <p>Title or Body Can't be empty.</p>:<p></p>}
						</Form>
					</Container>
				</div>
			)
	}


}