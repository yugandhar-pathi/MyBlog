import React, { Component } from 'react';
import { Container,List,Button,Header } from 'semantic-ui-react'
import {  NavLink } from 'react-router-dom';

export default class HomePage extends Component {

	constructor(props){
		super(props)
		
		this.state = {
		  error: null,
		  isLoaded: false,
		  items: []
		};
		
		/*this.state = {
		  error: null,
		  isLoaded: true,
		  items:[{"_id":"5a8a82076c79bb0e6cb24f05","title":"hi","author":"pathi","date":"2018-02-19T00:00:00.000Z"},{"_id":"5a8a82086c79bb0e6cb24f06","title":"hi","date":"2018-02-19T00:00:00.000Z"}]
		};*/
		
		this.postBlog = this.postBlog.bind(this);
	}
	
	componentDidMount() {
		/*
			Fetch list of Blogs posted by all users.
		*/
		fetch("/fetchBlogList")
		  .then(res => res.json())
		  .then(
			(result) => {
			  //Blog det
			  this.setState({
				isLoaded: true,
				items: result.items.reverse()
			  });
			},
			(error) => {
			  this.setState({
				isLoaded: true,
				error : error
			  });
			}
		  )
	}
	
	/*
		User should authenticate before posting a blog.
	*/
	postBlog(){
		var myApp = this;
		fetch("/isAuthenticationRequired",{
			credentials: 'same-origin',
		}).then(res => res.json())
		  .then(
			(result) => {
				if(result.auth){
					//User is already authenticated, display screen to post a blog
					myApp.props.history.push("/PostBlog/"+result.userid);
				}else{
					//User is not authenticated, display login screen
					myApp.props.history.push("/Login");
				}
			},
			(error) => {
				//fall back case.
				myApp.props.history.push("/Login");
			}
		  )
	}

	render(){
		const { error, isLoaded, items } = this.state;
		return (
			<Container textAlign="justified">
				<Header as='h1'>Thanks for reaching my Website!!</Header>
				<p>I plan to use this website to note my technical learnings. </p>
				<p>It helps me in two ways ..one review my learnings, two helps others too!! </p>
				<p>You find any interisting topic and would like to post? Please go ahead.</p>
				<Button onClick={this.postBlog}>PostBlog</Button>
				{ !isLoaded ?  <div>Loading...</div> :
					<div>
						<Header as='h3'>Please find below list of topics posted till now.</Header>
						<List>
							{items.map(item => (
								<List.Item key={item._id}>
									<NavLink to={'/DisplayBlog/'+item._id}>
										<List.Content>
											<List.Header>{item.title}</List.Header>
											<List.Description> Posted by ..<b>{item.author}</b> on {item.date}</List.Description>
										</List.Content>
									</NavLink>
								</List.Item>
							  ))}
						</List>
					</div>
				}
				{ error ? <div>Error: {error.message}</div> : <p></p> }
			</Container>
		);
	}
}