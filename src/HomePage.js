import React, { Component } from 'react';
import { Container,List,Button } from 'semantic-ui-react'
import {  NavLink } from 'react-router-dom';

export default class HomePage extends Component {

	constructor(props){
		super(props)
		
		/*this.state = {
		  error: null,
		  isLoaded: false,
		  items: []
		};*/
		
		this.state = {
		  error: null,
		  isLoaded: true,
		  items:[{"_id":"5a8a82076c79bb0e6cb24f05","title":"hi","date":"2018-02-19T00:00:00.000Z"},{"_id":"5a8a82086c79bb0e6cb24f06","title":"hi","date":"2018-02-19T00:00:00.000Z"}]
		};
		
		this.postBlog = this.postBlog.bind(this);
	}
	
	
	componentDidMount() {
		/*fetch("/fetchBlogList")
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				isLoaded: true,
				items: result.items
			  });
			},
			(error) => {
			  this.setState({
				isLoaded: true,
				error
			  });
			}
		  )*/
	}
	
	postBlog(){
		var myApp = this;
		fetch("/isAuthenticationRequired")
		  .then(res => res.json())
		  .then(
			(result) => {
				//User is already authenticated, take him to post a blog page.
				if(result.resultCode === 0){
					myApp.props.history.push("/PostBlog");
				}else{
					myApp.props.history.push("/Login");
				}
			},
			(error) => {
				//User is not authenticated take him to login page.
				myApp.props.history.push("/Login");
			}
		  )
	}

	render(){
		const { error, isLoaded, items } = this.state;
		if (error) {
		  return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
		  return <div>Loading...</div>;
		} else {
		  return (

				<Container textAlign="justified">
					<Button onClick={this.postBlog}>PostBlog</Button>
					<List>
						{items.map(item => (
							<List.Item key={item._id}>
								<NavLink to={'/DisplayBlog/'+item._id}>
									<List.Content>
										<List.Header>{item.title}</List.Header>
										<List.Description> by ..{item.author} on {item.date}</List.Description>
									</List.Content>
								</NavLink>
							</List.Item>
						  ))}
					</List>
				</Container>

		  );
		}
	}


}